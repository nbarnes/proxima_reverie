'use strict';

import Tile from './tile';
import Map from './map';
import Entity from './entity';
import { Assets } from './asset_manager';
import { Input } from './input';
import { MobileBrain } from './brain';
import { TileHighlighter } from './tile_highlighter';

const BinarySearchTree = require('binary-search-tree').BinarySearchTree;

export default class Scene {
  constructor(sceneDef, viewport, viewportDimensions, loadCompleteCallback) {
    let tiles = sceneDef.mapDef.tileImagePaths.map(tileImagePath => {
      return new Tile([tileImagePath]);
    });

    this.drawOrderSortedEntities = new BinarySearchTree();
    this.map = new Map(tiles, sceneDef.mapDef.mapSize);
    this.mobiles = sceneDef.mobileDefs.map(mobileDef => {
      return new Entity(mobileDef, this, new MobileBrain());
    });
    this.activeMobile = this.mobiles[0];
    this.props = sceneDef.propDefs.map(propDef => {
      return new Entity(propDef, this);
    });

    this.viewport = viewport;
    this.viewportDimensions = viewportDimensions;

    Assets.loadAssets(
      [...tiles, ...this.mobiles, ...this.props, TileHighlighter],
      () => {
        this.viewportOffsets = {
          x: this.map.mapCanvas.width / 2 - viewportDimensions.x / 2,
          y: this.map.mapCanvas.height / 2 - viewportDimensions.y / 2
        };
        loadCompleteCallback();
      }
    );

    this.waitingOnAnimation = false;
  }

  tick() {
    let mouseMovedEvent = Input.getMouseMovedEvent();
    if (mouseMovedEvent != undefined) {
      let cellPosition = getMouseEventCellPosition(
        mouseMovedEvent,
        this.viewport,
        this.viewportOffsets,
        this.map
      );
      if (!this.waitingOnAnimation) {
        TileHighlighter.mouseAt(this.map, cellPosition);
      }
    }

    let mouseUpEvent = Input.getMouseUpEvent();
    if (mouseUpEvent != undefined) {
      let cellPosition = getMouseEventCellPosition(
        mouseUpEvent,
        this.viewport,
        this.viewportOffsets,
        this.map
      );

      if (!this.waitingOnAnimation) {
        this.activeMobile.respondToMouse(
          this.map.cellAt(cellPosition),
          shouldWait => {
            this.waitingOnAnimation = shouldWait;
          }
        );

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
    this.props.forEach(prop => {
      prop.tick();
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
      this.viewportOffsets.x,
      this.viewportOffsets.y,
      this.viewportDimensions.x,
      this.viewportDimensions.y,
      0,
      0,
      this.viewportDimensions.x,
      this.viewportDimensions.y
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

    Input.resetInputs();
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
  let cellPosition = {
    x:
      (mapPosition.x / halfTileWidth + mapPosition.y / halfTileHeight) / 2 -
      halfMapSize,
    y:
      (mapPosition.y / halfTileHeight - mapPosition.x / halfTileWidth) / 2 +
      halfMapSize
  };
  return { x: Math.floor(cellPosition.x), y: Math.floor(cellPosition.y) };
}
