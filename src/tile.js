"use strict";

import { AssetManager } from "./asset_manager";

export default class Tile {
  constructor(assetPaths) {
    this.assetPaths = assetPaths;
    this.tileWidth = 128;
    this.tileHeight = 64;
    this.imageFrameIndex = 0;
  }

  get img() {
    return AssetManager.get(this.assetPaths[this.imageFrameIndex]);
  }
}
