"use strict";

import Tile from "./tile";
import Map from "./map";
import Entity from "./entity";
import {
  AwaitingInputGamestate,
  AutoscrollingGameState,
  AnimatingMobileGameState
} from "./game";
import { AssetManager } from "./assets";
import { BrainFactory } from "./brain";
import { CursorHighlight, SelectedMobileTileHighlight } from "./tile_highlight";
import {
  rand,
  mapCoordsForCell,
  buildPathBrensenham,
  coordsInBounds
} from "./util";

const BinarySearchTree = require("binary-search-tree").BinarySearchTree;

export default class Scene {
  constructor(game, sceneDef, viewport, loadCompleteCallback) {
    this.game = game;
    this.viewport = viewport;
    this.cameraOffsets = { x: 0, y: 0 };
    // @ts-ignore
    this.drawOrderSortedEntities = new BinarySearchTree();
    AssetManager.loadAssets(sceneDef.assetDefs, () => {
      this.assetLoadComplete(sceneDef, loadCompleteCallback);
    });
  }

  assetLoadComplete(sceneDef, loadCompleteCallback) {
    let tiles = [];
    for (let tileDef of sceneDef.mapDef.tileDefs) {
      tiles.push(new Tile(AssetManager.get(tileDef)));
    }
    this.map = new Map(tiles, sceneDef.mapDef.mapSize);
    this.mobiles = sceneDef.mobileDefs.map(mobileDef => {
      let entity = new Entity(mobileDef, this);
      entity.brain = BrainFactory.newBrain(mobileDef.brainName, entity);
      return entity;
    });
    this.bots = sceneDef.botDefs.map(botDef => {
      let entity = new Entity(botDef, this);
      entity.brain = BrainFactory.newBrain(botDef.brainName, entity);
      return entity;
    });
    this.props = sceneDef.propDefs.map(propDef => {
      return new Entity(propDef, this);
    });
    loadCompleteCallback();
  }

  tick(ticksElapsed) {
    if (ticksElapsed > 0) {
      for (let mobile of this.mobiles) {
        mobile.tick(ticksElapsed);
      }
      for (let bot of this.bots) {
        bot.tick(ticksElapsed);
      }
      for (let prop of this.props) {
        prop.tick(ticksElapsed);
      }
    }
  }

  draw() {
    let context = this.viewport.getContext("2d");
    context.rect(0, 0, this.viewport.width, this.viewport.height);
    context.fillStyle = "darkgrey";
    context.fill();
    context.drawImage(
      this.map.mapCanvas,
      this.cameraOffsets.x,
      this.cameraOffsets.y,
      this.viewport.width,
      this.viewport.height,
      0,
      0,
      this.viewport.width,
      this.viewport.height
    );

    if (this.cursorTileHighlight) {
      this.cursorTileHighlight.drawOnto(context, this.cameraOffsets);
    }

    if (this.selectedMobileTileHighlight) {
      this.selectedMobileTileHighlight.drawOnto(context, this.cameraOffsets);
    }

    this.drawOrderSortedEntities.executeOnEveryNode(node => {
      for (let entity of node.data) {
        entity.drawOnto(context, this.cameraOffsets);
      }
    });
  }

  handleCellClick(cellTarget) {
    if (cellTarget != undefined) {
      let cellContents = this.map.cellAt(cellTarget).contents[0];
      if (
        this.mobiles.includes(cellContents) &&
        cellContents != this.activeMobile &&
        this.unmovedPlayerEntities.includes(cellContents)
      ) {
        this.activeMobile = cellContents;
      } else {
        this.activeMobile.respondToMoveCommand(
          this.map.cellAt(cellTarget),
          () => {
            this.game.changeState(
              new AnimatingMobileGameState(this.game, this)
            );
          },
          () => {
            let activeMobileIndex = this.unmovedPlayerEntities.indexOf(
              this.activeMobile
            );
            this.unmovedPlayerEntities = this.unmovedPlayerEntities.filter(
              entity => {
                return entity != this.activeMobile;
              }
            );
            this.activeMobile.greyscale = true;
            if (this.unmovedPlayerEntities.length > 0) {
              this.activeMobile = this.unmovedPlayerEntities[activeMobileIndex];
            } else {
              for (let mobile of this.mobiles) {
                mobile.greyscale = false;
              }
              this.startEnemyPhase();
            }
          }
        );
      }
    }
  }

  addEntityToDraw(entity) {
    this.drawOrderSortedEntities.insert(
      entity.cellLocation.x + entity.cellLocation.y,
      entity
    );
  }

  removeEntityFromDraw(entity) {
    this.drawOrderSortedEntities.delete(
      entity.cellLocation.x + entity.cellLocation.y,
      entity
    );
  }

  startPlayerPhase() {
    this.unmovedPlayerEntities = this.mobiles.slice(0);
    this.activateNextPlayerMobile();
  }

  activateNextPlayerMobile() {
    if (
      this.unmovedPlayerEntities.slice(-1)[0] == this.activeMobile ||
      this.activeMobile == undefined
    ) {
      this.game.changeState(new AwaitingInputGamestate(this.game, this));
      this.activeMobile = this.unmovedPlayerEntities[0];
    } else {
      this.game.changeState(new AwaitingInputGamestate(this.game, this));
      this.activeMobile = this.mobiles[
        this.unmovedPlayerEntities.indexOf(this.activeMobile) + 1
      ];
    }
  }

  activatePlayerMobileAtIndex(index) {}

  startEnemyPhase() {
    this.remainingEnemyMobiles = this.bots.slice(0);
    this.doEnemyMove(this.remainingEnemyMobiles[0]);
  }

  doEnemyMove(enemy) {
    let cellLocation = this.getEnemyMoveLocationTarget();
    enemy.respondToMoveCommand(
      this.map.cellAt(cellLocation),
      () => {
        this.game.changeState(new AnimatingMobileGameState(this.game, this));
      },
      () => {
        this.remainingEnemyMobiles = this.remainingEnemyMobiles.filter(
          entity => {
            return entity != enemy;
          }
        );
        if (this.remainingEnemyMobiles.length == 0) {
          this.startPlayerPhase();
        } else {
          this.doEnemyMove(this.remainingEnemyMobiles[0]);
        }
      }
    );
  }

  getEnemyMoveLocationTarget() {
    return { x: rand(this.map.mapSize), y: rand(this.map.mapSize) };
  }

  set activeMobile(newActiveMobile) {
    this.myActiveMobile = newActiveMobile;
    if (newActiveMobile != undefined) {
      this.placeSelectedMobileTileHighlight(newActiveMobile.cellLocation);
      let newOffsets = mapCoordsForCell(newActiveMobile.cellLocation, this.map);
      newOffsets.x -= this.viewport.width / 2 - this.map.tileSize.width / 2;
      newOffsets.y -= this.viewport.height / 2;
      this.scrollToLocation(newOffsets);
    }
  }

  get activeMobile() {
    return this.myActiveMobile;
  }

  scrollToLocation(location, scrollSpeed) {
    let scrollTrack = buildPathBrensenham(this.cameraOffsets, location);
    this.game.changeState(
      new AutoscrollingGameState(this.game, this, scrollTrack, scrollSpeed)
    );
  }

  placeCursorTileHighlight(cellTarget) {
    this.cursorTileHighlight = undefined;
    if (cellTarget) {
      this.cursorTileHighlight = new CursorHighlight(
        mapCoordsForCell(cellTarget, this.map)
      );
    }
  }

  placeSelectedMobileTileHighlight(cellTarget) {
    this.selectedMobileTileHighlight = undefined;
    if (cellTarget) {
      this.selectedMobileTileHighlight = new SelectedMobileTileHighlight(
        mapCoordsForCell(cellTarget, this.map)
      );
    }
  }

  // Takes the cursor location within the viewport and returns the location
  // within the larger scene map. See also getMouseEventCellLocation().
  getMouseEventMapLocation(cursorLocation) {
    if (cursorLocation) {
      let rect = this.viewport.getBoundingClientRect();
      let cursorViewportLocation = {
        x: cursorLocation.clientX - rect.left,
        y: cursorLocation.clientY - rect.top
      };
      return {
        x: this.cameraOffsets.x + cursorViewportLocation.x,
        y: this.cameraOffsets.y + cursorViewportLocation.y
      };
    }
  }

  // Requires a cursor location defined in terms of the entire map, NOT in terms
  // of the viewport. Use getMouseEventMapLocation() to translate from viewport
  // location to map location.
  getMouseEventCellLocation(cursorLocation) {
    if (cursorLocation) {
      let halfTileWidth = this.map.tileSize.width / 2;
      let halfTileHeight = this.map.tileSize.height / 2;
      let halfMapSize = this.map.mapSize / 2;
      let fractionalCellLocation = {
        x:
          (cursorLocation.x / halfTileWidth +
            cursorLocation.y / halfTileHeight) /
            2 -
          halfMapSize,
        y:
          (cursorLocation.y / halfTileHeight -
            cursorLocation.x / halfTileWidth) /
            2 +
          halfMapSize
      };
      let cellLocation = {
        x: Math.floor(fractionalCellLocation.x),
        y: Math.floor(fractionalCellLocation.y)
      };
      if (coordsInBounds(cellLocation, this.map.mapSize)) {
        return cellLocation;
      } else {
        return undefined;
      }
    }
  }
}
