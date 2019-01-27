"use strict";

import Tile from "./tile";
import Map from "./map";
import Entity from "./entity";
import { Assets } from "./asset_manager";
import { MobileBrain } from "./brain";
import { TileHighlighter } from "./tile_highlighter";
import { PubSub } from "./pub_sub";
import { mapCoordsForCell, buildPathBrensenham, coordsInBounds } from "./util";

const BinarySearchTree = require("binary-search-tree").BinarySearchTree;

export default class Scene {
  constructor(sceneDef, viewport, loadCompleteCallback) {
    let tiles = sceneDef.mapDef.tileImagePaths.map(tileImagePath => {
      return new Tile([tileImagePath]);
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
    this.camera_scroll = undefined;

    this.viewport = viewport;

    this.inputDisabled = false;

    Assets.loadAssets(
      [...tiles, ...this.mobiles, ...this.props, TileHighlighter],
      () => {
        // the viewport offsets are set in the loading callback because the
        // tile image assets need to be fully loaded before the map can be drawn
        if (this.mobiles.length > 0) {
          this.activateNextMobile();
        } else {
          this.viewportOffsets = {
            x: this.map.mapCanvas.width / 2 - viewport.width / 2,
            y: this.map.mapCanvas.height / 2 - viewport.height / 2
          };
        }
        this.assetsLoaded = true;
        loadCompleteCallback();
      }
    );

    PubSub.subscribe("inputBlockingActivityStarted", () => {
      this.inputDisabled = true;
    });

    PubSub.subscribe("inputBlockingActivityFinished", () => {
      this.inputDisabled = false;
      this.activateNextMobile();
    });

    PubSub.subscribe("mousemove", event => {
      if (this.assetsLoaded) {
        let cellLocation = getMouseEventCellPosition(
          event,
          this.viewport,
          this.viewportOffsets,
          this.map
        );
        if (cellLocation) {
          PubSub.publish("mouseOverCell", {
            cellLocation: cellLocation,
            map: this.map
          });
        }
      }
    });

    PubSub.subscribe("mouseup", event => {
      let cellPosition = getMouseEventCellPosition(
        event,
        this.viewport,
        this.viewportOffsets,
        this.map
      );

      if (cellPosition != undefined && !this.inputDisabled) {
        let cellContents = this.map.cellAt(cellPosition).contents[0];
        if (
          this.mobiles.includes(cellContents) &&
          cellContents != this.activeMobile
        ) {
          this.activeMobile = cellContents;
        } else {
          this.activeMobile.respondToMouse(
            this.map.cellAt(cellPosition),
            () => {
              PubSub.publish("inputBlockingActivityStarted");
            },
            () => {
              PubSub.publish("inputBlockingActivityFinished");
            }
          );
        }
      }
    });
  }

  tick(ticksElapsed) {
    if (ticksElapsed > 0) {
      if (this.camera_scroll != undefined) {
        this.camera_scroll.advance(ticksElapsed);
      }
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
      this.viewportOffsets.x,
      this.viewportOffsets.y,
      this.viewport.width,
      this.viewport.height,
      0,
      0,
      this.viewport.width,
      this.viewport.height
    );

    TileHighlighter.draw(context, this.viewportOffsets, {
      x: this.map.tileWidth,
      y: this.map.tileHeight
    });

    this.drawOrderSortedEntities.executeOnEveryNode(node => {
      for (let entity of node.data) {
        context.drawImage(
          entity.image,
          entity.frameXOrigin,
          entity.frameYOrigin,
          entity.frameSize.width,
          entity.frameSize.height,
          entity.location.x - this.viewportOffsets.x,
          entity.location.y - this.viewportOffsets.y,
          entity.frameSize.width,
          entity.frameSize.height
        );
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
      this.zoomToLocation(newOffsets);
    }
    PubSub.publish("activeMobileChanged", {
      map: this.map,
      mobile: this.activeMobile
    });
  }

  get activeMobile() {
    return this.myActiveMobile;
  }

  zoomToLocation(location) {
    if (this.viewportOffsets != undefined) {
      this.inputDisabled = true;
      let zoomTrack = buildPathBrensenham(this.viewportOffsets, location);
      this.camera_scroll = {
        advance: nTimes => {
          let i = 0;
          do {
            if (zoomTrack.length > 0) {
              this.viewportOffsets = zoomTrack.shift();
              if (zoomTrack.length == 0) {
                this.inputDisabled = false;
                this.camera_scroll = undefined;
              }
            }
          } while (i++ < nTimes * 10);
        }
      };
    } else {
      this.viewportOffsets = location;
    }
  }
}

function getMouseEventCellPosition(event, viewport, viewportOffsets, map) {
  let rect = viewport.getBoundingClientRect();
  let viewportPosition = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
  let mapPosition = {
    x: viewportOffsets.x + viewportPosition.x,
    y: viewportOffsets.y + viewportPosition.y
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
