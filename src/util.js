'use strict';

export const rand = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const coordsEqual = (a, b) => {
  return a.x == b.x && a.y == b.y;
};

export const entityMapLocationFromTile = (
  tile,
  map,
  frameWidth,
  frameHeight
) => {
  let mapDestination = map.mapCoordsForTile({ x: tile.x, y: tile.y });
  let tileOffset = map.tileOffsets;
  let frameOffset = { x: frameWidth / 2, y: frameHeight };
  return {
    x: mapDestination.x + tileOffset.x - frameOffset.x,
    y: mapDestination.y + tileOffset.y - frameOffset.y
  };
};

export const Facing = {
  SOUTHEAST: 7,
  SOUTHWEST: 1,
  NORTHWEST: 3,
  NORTHEAST: 5
};
