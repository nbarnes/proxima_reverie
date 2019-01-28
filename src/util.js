"use strict";

export const rand = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const lesserOf = (a, b) => {
  if (a <= b) {
    return a;
  } else {
    return b;
  }
};

export const throttle = (callback, delay) => {
  let wait = false;
  return function(arg) {
    if (!wait) {
      callback(arg);
      wait = true;
      setTimeout(function() {
        wait = false;
      }, delay);
    }
  };
};

export const coordsEqual = (a, b) => {
  if (a.x == undefined || b.x == undefined) {
    console.log("Undefined value in util.coordsEqual");
    console.log(`a.x: ${a.x} a.y: ${a.y} b.x: ${b.x} b.y: ${b.y}`);
  }
  return a.x == b.x && a.y == b.y;
};

export const arrayIncludesCoords = (arr, coord_a) => {
  return (
    arr.filter(coord_b => {
      return coordsEqual(coord_a, coord_b);
    }).length > 0
  );
};

export const entityMapLocationFromCell = (cell, map, frameOffsets) => {
  let mapDestination = mapCoordsForCell({ x: cell.x, y: cell.y }, map);
  let tileOffsets = map.tileOffsets;
  let mapLocation = {
    x: mapDestination.x + tileOffsets.x - frameOffsets.x,
    y: mapDestination.y + tileOffsets.y - frameOffsets.y
  };
  return mapLocation;
};

export const mapCoordsForCell = (cellCoords, map) => {
  let xOffset = (map.mapSize * map.tileWidth) / 2 - map.tileWidth / 2;
  let mapX = (cellCoords.x - cellCoords.y) * (map.tileWidth / 2) + xOffset;
  let mapY = (cellCoords.x + cellCoords.y) * (map.tileHeight / 2);
  return { x: mapX, y: mapY };
};

export const Facing = {
  SOUTHEAST: 7,
  SOUTHWEST: 1,
  NORTHWEST: 3,
  NORTHEAST: 5
};

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Uses Brensenham's line algorithm
export const buildPathBrensenham = (start, end, useDiagonal) => {
  let path = [];

  let currentX = start.x,
    currentY = start.y;
  let deltaX = Math.abs(end.x - start.x),
    deltaY = Math.abs(end.y - start.y);
  let slopeX = start.x < end.x ? 1 : -1,
    slopeY = start.y < end.y ? 1 : -1;
  let err = deltaX - deltaY;

  while (currentX != end.x || currentY != end.y) {
    if (useDiagonal) {
      if (2 * err > deltaY * -1) {
        err -= deltaY;
        currentX += slopeX;
      }
      if (2 * err < deltaX) {
        err += deltaX;
        currentY += slopeY;
      }
    } else {
      if (2 * err > deltaY * -1) {
        err -= deltaY;
        currentX += slopeX;
      } else if (2 * err < deltaX) {
        err += deltaX;
        currentY += slopeY;
      }
    }

    path.push({ x: currentX, y: currentY });
  }
  return path;
};

export const coordsInBounds = (coords, boundingSize) => {
  return (
    coords.x >= 0 &&
    coords.y >= 0 &&
    coords.x < boundingSize &&
    coords.y < boundingSize
  );
};
