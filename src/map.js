'use strict';

import { rand } from './util';
import Cell from './cell';

export default class Map {
  constructor(tiles, mapSize) {
    this.tiles = tiles;
    this.mapSize = mapSize;
    this.tileWidth = tiles[0].tileWidth;
    this.tileHeight = tiles[0].tileHeight;
    this.cells = buildCells(this);
  }

  get mapCanvas() {
    if (this.myMapCanvas == undefined) {
      this.myMapCanvas = drawMapCanvas(this);
    }
    return this.myMapCanvas;
  }

  mapCoordsForCell(cellCoords) {
    let xOffset = (this.mapSize * this.tileWidth) / 2 - this.tileWidth / 2;
    let mapX = (cellCoords.x - cellCoords.y) * (this.tileWidth / 2) + xOffset;
    let mapY = (cellCoords.x + cellCoords.y) * (this.tileHeight / 2);
    return { x: mapX, y: mapY };
  }

  get tileOffsets() {
    return { x: this.tileWidth / 2, y: this.tileHeight / 2 };
  }

  cellAt(coords) {
    return this.cells[coords.x][coords.y];
  }

  neighbors(coords) {
    let neighbors = [];
    if (coords.x < this.mapSize - 1) {
      neighbors.push(this.cells[coords.x + 1][coords.y]);
    }
    if (coords.x > 0) {
      neighbors.push(this.cells[coords.x - 1][coords.y]);
    }
    if (coords.y < this.mapSize - 1) {
      neighbors.push(this.cells[coords.x][coords.y + 1]);
    }
    if (coords.y > 0) {
      neighbors.push(this.cells[coords.x][coords.y - 1]);
    }
    return neighbors;
  }
}

function buildCells(map) {
  let cells = [];
  for (let i = 0; i < map.mapSize; i++) {
    cells[i] = [];
    for (let j = 0; j < map.mapSize; j++) {
      cells[i][j] = new Cell(map.tiles[rand(map.tiles.length)], map, {
        x: i,
        y: j
      });
    }
  }
  return cells;
}

function drawMapCanvas(map) {
  let mapCanvas = document.createElement('canvas');
  mapCanvas.width = map.mapSize * map.tileWidth - map.mapSize;
  mapCanvas.height = map.mapSize * map.tileHeight - map.mapSize;

  for (let [x, row] of map.cells.entries()) {
    for (let [y, cell] of row.entries()) {
      drawTile(map, mapCanvas.getContext('2d'), cell.tile, x, y);
    }
  }
  return mapCanvas;
}

function drawTile(map, context, tile, mapX, mapY) {
  let contextCoords = map.mapCoordsForCell({ x: mapX, y: mapY });
  context.drawImage(
    tile.img,
    contextCoords.x,
    contextCoords.y,
    map.tileWidth,
    map.tileHeight
  );
}
