"use strict";

import Tile from "./tile";
import Map from "./map";
import Entity from "./entity";
import { AutoscrollingGameState } from "./game";
import { ImageManager } from "./assets";
import { MobileBrain } from "./brain";
import { mapCoordsForCell, buildPathBrensenham, coordsInBounds } from "./util";

const BinarySearchTree = require("binary-search-tree").BinarySearchTree;

export default class Scene {
  constructor(game, sceneDef, viewport, loadCompleteCallback) {
    this.game = game;
    let tiles = sceneDef.mapDef.tileDefs.map(tileDef => {
      return new Tile(tileDef.imagePath, tileDef.frameSize);
    });

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

    // PubSub.subscribe("inputBlockingActivityStarted", () => {
    //   this.inputDisabled = true;
    // });

    // PubSub.subscribe("inputBlockingActivityFinished", () => {
    //   this.inputDisabled = false;
    // });

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

    // TileHighlighter.draw(context, this.cameraOffsets, {
    //   x: this.map.tileWidth,
    //   y: this.map.tileHeight
    // });

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
      newOffsets.x -= this.viewport.width / 2 - this.map.tileWidth / 2;
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
}

function getMouseEventCellPosition(event, viewport, cameraOffsets, map) {
  let rect = viewport.getBoundingClientRect();
  let viewportPosition = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
  let mapPosition = {
    x: cameraOffsets.x + viewportPosition.x,
    y: cameraOffsets.y + viewportPosition.y
  };
  let halfTileWidth = map.tileWidth / 2;
  let halfTileHeight = map.tileHeight / 2;
  let halfMapSize = map.mapSize / 2;
  let fractionalCellPosition = {
    x:
      (mapPosition.x / halfTileWidth + mapPosition.y / halfTileHeight) / 2 -
      halfMapSize,
    y:
      (mapPosition.y / halfTileHeight - mapPosition.x / halfTileWidth) / 2 +
      halfMapSize
  };
  let cellPosition = {
    x: Math.floor(fractionalCellPosition.x),
    y: Math.floor(fractionalCellPosition.y)
  };
  if (coordsInBounds(cellPosition, map.mapSize)) {
    return cellPosition;
  } else {
    return undefined;
  }
}
