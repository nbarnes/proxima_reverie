"use strict";

export default class Tile {
  constructor(asset) {
    this.myAsset = asset;
  }

  get image() {
    return this.myAsset.image;
  }
}
