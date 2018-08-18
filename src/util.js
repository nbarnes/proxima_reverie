'use strict';

export const rand = max => {
  return Math.floor(Math.random() * Math.floor(max));
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
    console.log('Undefined value in util.coordsEqual');
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
  let mapDestination = map.mapCoordsForCell({ x: cell.x, y: cell.y });
  let tileOffsets = map.tileOffsets;
  let mapLocation = {
    x: mapDestination.x + tileOffsets.x - frameOffsets.x,
    y: mapDestination.y + tileOffsets.y - frameOffsets.y
  };
  return mapLocation;
};

export const Facing = {
  SOUTHEAST: 7,
  SOUTHWEST: 1,
  NORTHWEST: 3,
  NORTHEAST: 5
};
