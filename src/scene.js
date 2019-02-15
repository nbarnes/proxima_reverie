"use strict";

import Tile from "./tile";
import Map from "./map";
import Entity from "./entity";
import {
  AwaitingInputGamestate,
  AutoscrollingGameState,
  AnimatingMobileGameState
} from "./game";
import { ImageManager } from "./assets";
import { BrainFactory } from "./brain";
import { CursorHighlight, SelectedMobileTileHighlight } from "./tile_highlight";
import { mapCoordsForCell, buildPathBrensenham, coordsInBounds } from "./util";

const BinarySearchTree = require("binary-search-tree").BinarySearchTree;

export default class Scene {
  constructor(game, sceneDef, viewport, loadCompleteCallback) {
    this.game = game;
    let tiles = sceneDef.mapDef.tileDefs.map(tileDef => {
      return new Tile(tileDef.imagePath, tileDef.frameSize);
    });

    this.cursorTileHighlight = undefined;
    // @ts-ignore
    this.drawOrderSortedEntities = new BinarySearchTree();
    this.map = new Map(tiles, sceneDef.mapDef.mapSize);
    this.mobiles = sceneDef.mobileDefs.map(mobileDef => {
      let entity = new Entity(mobileDef, this);
      entity.brain = BrainFactory.newBrain(mobileDef.brainName, entity);
      return entity;
    });
    this.props = sceneDef.propDefs.map(propDef => {
      return new Entity(propDef, this);
    });
    this.tileHighlights = [];

    this.viewport = viewport;
    this.cameraOffsets = { x: 0, y: 0 };

    ImageManager.loadImages([...tiles, ...this.mobiles, ...this.props], () => {
      loadCompleteCallback();
    });
  }

  tick(ticksElapsed) {
    if (ticksElapsed > 0) {
      for (let mobile of this.mobiles) {
        mobile.tick(ticksElapsed);
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
        cellContents != this.activeMobile
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
            this.game.changeState(new AwaitingInputGamestate(this.game, this));
            this.activateNextMobile();
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

  activateNextMobile() {
    if (
      this.mobiles.slice(-1)[0] == this.activeMobile ||
      this.activeMobile == undefined
    ) {
      this.activeMobile = this.mobiles[0];
    } else {
      this.activeMobile = this.mobiles[
        this.mobiles.indexOf(this.activeMobile) + 1
      ];
    }
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

  scrollToLocation(location) {
    let scrollTrack = buildPathBrensenham(this.cameraOffsets, location);
    this.game.changeState(
      new AutoscrollingGameState(this.game, this, scrollTrack)
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

  // Take the cursor location within the viewport and returns the location
  // within the larger scene map.  See also getMouseEventCellLocation().
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
  // of the viewport.  Use getMouseEventMapLocation() to translate from viewport
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
