'use strict';

import Tile from './tile';
import Map from './map';
import Entity from './entity';
import { Assets } from './asset_manager';
import { Input } from './input';
import { MobileBrain } from './brain';

export default class Scene {
  constructor(sceneDef, viewport, viewportDimensions, loadCompleteCallback) {
    let tiles = sceneDef.mapDef.tileImagePaths.map(tileImagePath => {
      return new Tile([tileImagePath]);
    });

    this.map = new Map(tiles, sceneDef.mapDef.mapSize);

    this.entities = sceneDef.entityDefs.map(entityDef => {
      return new Entity(entityDef, this.map, new MobileBrain());
    });
    this.activeEntity = this.entities[0];

    this.viewport = viewport;
    this.viewportDimensions = viewportDimensions;

    Assets.loadAssets([...tiles, ...this.entities], () => {
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
        this.activeEntity.respondToMouse(tilePosition, shouldWait => {
          this.waitingOnAnimation = shouldWait;
        });

        if (this.entities.slice(-1)[0] == this.activeEntity) {
          this.activeEntity = this.entities[0];
        } else {
          this.activeEntity = this.entities[
            this.entities.indexOf(this.activeEntity) + 1
          ];
        }
      }
    }

    this.entities.forEach(entity => {
      entity.tick();
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

    this.entities.forEach(entity => {
      context.drawImage(
        entity.image,
        entity.frameXOrigin,
        entity.frameYOrigin,
        entity.frameWidth,
        entity.frameHeight,
        entity.location.x - this.viewportOffsetDimensions.x,
        entity.location.y - this.viewportOffsetDimensions.y,
        entity.frameWidth,
        entity.frameHeight
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
