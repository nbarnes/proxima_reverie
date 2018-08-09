'use strict';

import { Assets } from './asset_manager';
import AssetOwner from './asset_owner';

export default class Tile extends AssetOwner {
  constructor(assetPaths) {
    super(assetPaths);
    this.tileWidth = 128;
    this.tileHeight = 64;
    this.imageFrameIndex = 0;
  }

  get img() {
    return Assets.get(this.assetPaths[this.imageFrameIndex]);
  }
}
