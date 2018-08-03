'use strict';

import { rand } from './util';

export default class Map {
  constructor(tiles, mapSize) {
    this.tiles = tiles;
    this.mapSize = mapSize;
    this.tileWidth = tiles[0].tileWidth;
    this.tileHeight = tiles[0].tileHeight;
    this.mapDef = buildMapDef(this);
  }

  get mapCanvas() {
    if (this.myMapCanvas == undefined) {
      this.myMapCanvas = drawMapCanvas(this);
    }
    return this.myMapCanvas;
  }

  mapCoordsForTile(tileCoords) {
    let xOffset = (this.mapSize * this.tileWidth) / 2 - this.tileWidth / 2;
    let mapX = (tileCoords.x - tileCoords.y) * (this.tileWidth / 2) + xOffset;
    let mapY = (tileCoords.x + tileCoords.y) * (this.tileHeight / 2);
    return { x: mapX, y: mapY };
  }

  get tileOffsets() {
    return { x: this.tileWidth / 2, y: this.tileHeight / 2 };
  }
}

function buildMapDef(map) {
  let mapDef = [];
  for (let i = 0; i < map.mapSize; i++) {
    mapDef[i] = [];
    for (let j = 0; j < map.mapSize; j++) {
      mapDef[i][j] = map.tiles[rand(map.tiles.length)];
    }
  }
  return mapDef;
}

function drawMapCanvas(map) {
  let mapCanvas = document.createElement('canvas');
  mapCanvas.width = map.mapSize * map.tileWidth - map.mapSize;
  mapCanvas.height = map.mapSize * map.tileHeight - map.mapSize;

  for (let [x, row] of map.mapDef.entries()) {
    for (let [y, tile] of row.entries()) {
      drawTile(map, mapCanvas.getContext('2d'), tile, x, y);
    }
  }
  return mapCanvas;
}

function drawTile(map, context, tile, mapX, mapY) {
  let contextCoords = map.mapCoordsForTile({ x: mapX, y: mapY });
  context.drawImage(
    tile.img,
    contextCoords.x,
    contextCoords.y,
    map.tileWidth,
    map.tileHeight
  );
}
