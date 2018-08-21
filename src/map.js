'use strict';

import { rand, mapCoordsForCell } from './util';
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
      // @ts-ignore
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
  mapCanvas.width = map.mapSize * map.tileWidth;
  mapCanvas.height = map.mapSize * map.tileHeight;
  let context = mapCanvas.getContext('2d');
  context.rect(0, 0, mapCanvas.width, mapCanvas.height);
  context.fillStyle = 'lightgrey';
  context.fill();
  for (let [x, row] of map.cells.entries()) {
    for (let [y, cell] of row.entries()) {
      drawTile(map, context, cell.tile, x, y);
    }
  }
  return mapCanvas;
}

function drawTile(map, context, tile, mapX, mapY) {
  let contextCoords = mapCoordsForCell({ x: mapX, y: mapY }, map);
  context.drawImage(
    tile.img,
    contextCoords.x,
    contextCoords.y,
    map.tileWidth,
    map.tileHeight
  );
}
