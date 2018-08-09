'use strict';

export default class Cell {
  constructor(tile, map, coords) {
    this.tile = tile;
    this.map = map;
    this.coords = coords;
  }

  get neighbors() {
    return this.map.neighbors(this.coords);
  }

  get x() {
    return this.coords.x;
  }

  get y() {
    return this.coords.y;
  }
}
