"use strict";

import Tile from "./tile";
import Map from "./map";
import Entity from "./entity";
import { AutoscrollingGameState } from "./game";
import { ImageManager } from "./assets";
import { MobileBrain } from "./brain";
import { CursorHighlight } from "./tile_highlight";
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
      return new Entity(mobileDef, this, new MobileBrain());
    });
    this.props = sceneDef.propDefs.map(propDef => {
      return new Entity(propDef, this);
    });
    this.tileHighlights = [];

    this.viewport = viewport;
    this.cameraOffsets = { x: 0, y: 0 };

    this.inputDisabled = false;

    ImageManager.loadImages([...tiles, ...this.mobiles, ...this.props], () => {
      loadCompleteCallback();
    });

    // PubSub.subscribe("mousemove", event => {
    //   if (this.assetsLoaded) {
    //     let cellLocation = getMouseEventCellPosition(
    //       event,
    //       this.viewport,
    //       this.cameraOffsets,
    //       this.map
    //     );
    //     if (cellLocation) {
    //       PubSub.publish("mouseOverCell", {
    //         cellLocation: cellLocation,
    //         map: this.map
    //       });
    //     }
    //   }
    // });

    // PubSub.subscribe("mouseup", event => {
    //   let cellPosition = getMouseEventCellPosition(
    //     event,
    //     this.viewport,
    //     this.cameraOffsets,
    //     this.map
    //   );

    //   if (cellPosition != undefined && !this.inputDisabled) {
    //     let cellContents = this.map.cellAt(cellPosition).contents[0];
    //     if (
    //       this.mobiles.includes(cellContents) &&
    //       cellContents != this.activeMobile
    //     ) {
    //       this.activeMobile = cellContents;
    //     } else {
    //       this.activeMobile.respondToMouse(
    //         this.map.cellAt(cellPosition),
    //         () => {
    //           PubSub.publish("inputBlockingActivityStarted");
    //         },
    //         () => {
    //           PubSub.publish("inputBlockingActivityFinished");
    //           this.activateNextMobile();
    //         }
    //       );
    //     }
    //   }
    // });
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

    this.drawOrderSortedEntities.executeOnEveryNode(node => {
      for (let entity of node.data) {
        entity.drawOnto(context, this.cameraOffsets);
      }
    });
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

  placeCursorTileHighlight(mouseMovementEvent) {
    this.cursorTileHighlight = undefined;
    let rect = this.viewport.getBoundingClientRect();
    let cursorViewportLocation = {
      x: mouseMovementEvent.clientX - rect.left,
      y: mouseMovementEvent.clientY - rect.top
    };
    let cursorMapLocation = {
      x: this.cameraOffsets.x + cursorViewportLocation.x,
      y: this.cameraOffsets.y + cursorViewportLocation.y
    };
    let cellLocation = getMouseEventCellPosition(cursorMapLocation, this.map);
    if (cellLocation) {
      this.cursorTileHighlight = new CursorHighlight(
        mapCoordsForCell(cellLocation, this.map)
      );
    }
  }
}

function getMouseEventCellPosition(cursorLocation, map) {
  let halfTileWidth = map.tileSize.width / 2;
  let halfTileHeight = map.tileSize.height / 2;
  let halfMapSize = map.mapSize / 2;
  let fractionalCellLocation = {
    x:
      (cursorLocation.x / halfTileWidth + cursorLocation.y / halfTileHeight) /
        2 -
      halfMapSize,
    y:
      (cursorLocation.y / halfTileHeight - cursorLocation.x / halfTileWidth) /
        2 +
      halfMapSize
  };
  let cellLocation = {
    x: Math.floor(fractionalCellLocation.x),
    y: Math.floor(fractionalCellLocation.y)
  };
  if (coordsInBounds(cellLocation, map.mapSize)) {
    return cellLocation;
  } else {
    return undefined;
  }
}
