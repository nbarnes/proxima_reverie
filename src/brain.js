'use strict';

import { entityMapLocationFromTile, coordsEqual } from './util';

export class MobileBrain {
  getActivity(entity, eventTile, blockingAnimationCallback) {
    let startTile = entity.currentTile;
    let endTile = eventTile;
    let tilePath = buildTilePath(startTile, endTile);
    let destination = undefined;
    blockingAnimationCallback(true);
    return () => {
      if (destination != undefined) {
        let nextPosition = getNextMapPosition(entity, destination);
        entity.location = nextPosition;
        if (coordsEqual(entity.location, destination)) {
          destination = undefined;
        }
      } else if (tilePath.length > 0) {
        destination = getDestination(entity, tilePath);
      } else {
        entity.activityDone();
        blockingAnimationCallback(false);
      }
    };
  }
}

function getNextMapPosition(entity, destination) {
  let dx = entity.location.x - destination.x,
    dy = entity.location.y - destination.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let velX = (dx / dist) * 5;
  let velY = (dy / dist) * 5;
  if (Math.abs(dx) < Math.abs(velX)) {
    velX = dx;
  }
  if (Math.abs(dy) < Math.abs(velY)) {
    velY = dy;
  }

  return { x: (entity.location.x -= velX), y: (entity.location.y -= velY) };
}

function getDestination(entity, tilePath) {
  let nextTileDestination = tilePath.shift();
  let nextDestination = undefined;
  if (nextTileDestination != undefined) {
    nextDestination = entityMapLocationFromTile(
      nextTileDestination,
      entity.map,
      entity.frameWidth,
      entity.frameHeight
    );
  }
  return nextDestination;
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

  let insanity = 0;
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
