'use strict';

import { Assets } from './asset_manager';
import AssetOwner from './asset_owner';
import { coordsEqual } from './util';

export default class Entity extends AssetOwner {
  constructor(entityDef, map) {
    super(entityDef.imagePaths);
    this.frameWidth = 60;
    this.frameHeight = 110;
    this.map = map;
    this.currentTile = {
      x: entityDef.startTile === undefined ? 0 : entityDef.startTile.x,
      y: entityDef.startTile === undefined ? 0 : entityDef.startTile.y
    };
    this.location = this.findMapPositionForTile(this.currentTile);
    this.tilePath = [];
    this.destination = undefined;
  }

  get image() {
    return Assets.get(this.assetPaths[0]);
  }

  get frameXOrigin() {
    return 0;
  }

  get frameYOrigin() {
    return 0;
  }

  respondToMouse(eventTile, blockingAnimationCallback) {
    if (eventTile != undefined) {
      this.tilePath = buildTilePath(this.currentTile, eventTile);
      this.updateDestination();
      blockingAnimationCallback(true);
      this.blockingAnimationCallback = blockingAnimationCallback;
    }
  }

  tick() {
    if (this.destination != undefined) {
      let dx = this.location.x - this.destination.x,
        dy = this.location.y - this.destination.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let velX = (dx / dist) * 5;
      let velY = (dy / dist) * 5;
      if (Math.abs(dx) < Math.abs(velX)) {
        velX = dx;
      }
      if (Math.abs(dy) < Math.abs(velY)) {
        velY = dy;
      }
      this.location.x -= velX;
      this.location.y -= velY;
      if (coordsEqual(this.location, this.destination)) {
        this.currentTile = this.tilePath.shift();
        this.updateDestination();
      }
    }
  }

  updateDestination() {
    let nextTileDestination = this.tilePath[0];
    if (nextTileDestination != undefined) {
      this.destination = this.findMapPositionForTile(nextTileDestination);
    } else {
      this.destination = undefined;
      this.blockingAnimationCallback(false);
    }
  }

  findMapPositionForTile(tile) {
    let mapDestination = this.map.mapCoordsForTile({ x: tile.x, y: tile.y });
    let tileOffset = this.map.tileOffsets();
    let frameOffset = { x: this.frameWidth / 2, y: this.frameHeight };
    return {
      x: mapDestination.x + tileOffset.x - frameOffset.x,
      y: mapDestination.y + tileOffset.y - frameOffset.y
    };
  }
}

// Uses Brensenham's line algorithm
function buildTilePath(start, end) {
  let path = [];

  let currentX = start.x,
    currentY = start.y;
  let deltaX = Math.abs(end.x - start.x),
    deltaY = Math.abs(end.y - start.y);
  let slopeX = start.x < end.x ? 1 : -1,
    slopeY = start.y < end.y ? 1 : -1;
  let err = deltaX - deltaY;

  while (currentX != end.x || currentY != end.y) {
    let err2 = 2 * err;
    if (err2 > deltaY * -1) {
      err -= deltaY;
      currentX += slopeX;
    } else if (err2 < deltaX) {
      err += deltaX;
      currentY += slopeY;
    }
    path.push({ x: currentX, y: currentY });
  }
  return path;
}
