"use strict";

import { Asset } from "./assets.js";

export default class Tile {
  constructor(imagePath, frameSize) {
    this.asset = new Asset(imagePath, frameSize);
  }

  get image() {
    return this.asset.image;
  }
}
