'use strict';

export const rand = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const coordsEqual = (a, b) => {
  if (a.x == undefined || b.x == undefined) {
    console.log('Undefined value in util.coordsEqual');
    console.log(`a.x: ${a.x} a.y: ${a.y} b.x: ${b.x} b.y: ${b.y}`);
  }
  // console.log('');
  // console.log('in coordsEqual(a, b) =>');
  // console.log(`a: ${a.constructor.name}`);
  // console.log(`  x${a.x}, y${a.y}`);
  // console.log(`a: ${b.constructor.name}`);
  // console.log(`  x${b.x}, y${b.y}`);
  // console.log('');
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
  // console.log('start entityMapLocationFromCell');
  // console.log(cell);
  let mapDestination = map.mapCoordsForCell({ x: cell.x, y: cell.y });
  let tileOffset = map.tileOffsets;
  let mapLocation = {
    x: mapDestination.x + tileOffset.x - frameOffsets.x,
    y: mapDestination.y + tileOffset.y - frameOffsets.y
  };
  // console.log(mapLocation);
  return mapLocation;
};

export const Facing = {
  SOUTHEAST: 7,
  SOUTHWEST: 1,
  NORTHWEST: 3,
  NORTHEAST: 5
};
