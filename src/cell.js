"use strict";

export default class Cell {
  constructor(tile, map, coords) {
    this.tile = tile;
    this.map = map;
    this.coords = coords;
    this.contents = [];
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

  addContents(entity) {
    this.contents.push(entity);
  }

  removeContents(entity) {
    this.contents = this.contents.filter(el => !(el == entity));
  }

  pathable() {
    return this.contents.length == 0;
  }
}
