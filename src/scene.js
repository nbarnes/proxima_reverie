'use strict';

import Tile from './tile';
import Map from './map';
import Entity from './entity';
import { Assets } from './asset_manager';
import { Input } from './input';

export default class Scene {
  constructor(sceneDef, viewport, viewportDimensions, loadCompleteCallback) {
    let tiles = sceneDef.mapDef.tileImagePaths.map(tileImagePath => {
      return new Tile([tileImagePath]);
    });

    this.map = new Map(tiles, sceneDef.mapDef.mapSize);

    this.mobiles = sceneDef.mobileDefs.map(mobileDef => {
      return new Entity(mobileDef, this.map);
    });
    this.activeMobile = this.mobiles[0];

    this.viewport = viewport;
    this.viewportDimensions = viewportDimensions;

    Assets.loadAssets([...tiles, ...this.mobiles], () => {
      this.viewportOffsetDimensions = {
        x: this.map.mapCanvas.width / 2 - viewportDimensions.x / 2,
        y: this.map.mapCanvas.height / 2 - viewportDimensions.y / 2
      };
      loadCompleteCallback();
    });

    this.waitingOnAnimation = false;
  }

  tick() {
    // console.log('tick');

    let mouseEvent = Input.getMouseEvent();
    if (mouseEvent != undefined) {
      let eventViewportPosition = getEventViewportPosition(
        this.viewport,
        mouseEvent
      );
      let eventMapPosition = getCursorMapPosition(
        this.viewportOffsetDimensions,
        eventViewportPosition
      );
      let tilePosition = getCursorTilePosition(this.map, eventMapPosition);

      if (!this.waitingOnAnimation) {
        this.activeMobile.respondToMouse(tilePosition, shouldWait => {
          this.waitingOnAnimation = shouldWait;
        });

        if (this.mobiles.slice(-1)[0] == this.activeMobile) {
          this.activeMobile = this.mobiles[0];
        } else {
          this.activeMobile = this.mobiles[
            this.mobiles.indexOf(this.activeMobile) + 1
          ];
        }
      }
    }

    this.mobiles.forEach(mobile => {
      mobile.tick();
    });

    let context = this.viewport.getContext('2d');
    context.clearRect(
      0,
      0,
      this.viewportDimensions.x,
      this.viewportDimensions.y
    );
    context.drawImage(
      this.map.mapCanvas,
      this.viewportOffsetDimensions.x,
      this.viewportOffsetDimensions.y,
      this.viewportDimensions.x,
      this.viewportDimensions.y,
      0,
      0,
      this.viewportDimensions.x,
      this.viewportDimensions.y
    );

    this.mobiles.forEach(mobile => {
      context.drawImage(
        mobile.image,
        mobile.frameXOrigin,
        mobile.frameYOrigin,
        mobile.frameWidth,
        mobile.frameHeight,
        mobile.location.x - this.viewportOffsetDimensions.x,
        mobile.location.y - this.viewportOffsetDimensions.y,
        mobile.frameWidth,
        mobile.frameHeight
      );
    });

    Input.resetInputs();
  }
}

function getCursorMapPosition(viewOffsets, position) {
  return { x: viewOffsets.x + position.x, y: viewOffsets.y + position.y };
}

function getCursorTilePosition(map, position) {
  let halfTileWidth = map.tileWidth / 2;
  let halfTileHeight = map.tileHeight / 2;
  let halfMapSize = map.mapSize / 2;
  let tileX =
    (position.x / halfTileWidth + position.y / halfTileHeight) / 2 -
    halfMapSize;
  let tileY =
    (position.y / halfTileHeight - position.x / halfTileWidth) / 2 +
    halfMapSize;
  return { x: Math.floor(tileX), y: Math.floor(tileY) };
}

function getEventViewportPosition(viewport, event) {
  let rect = viewport.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  return { x: x, y: y };
}
