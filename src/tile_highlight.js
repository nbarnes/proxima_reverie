"use strict";

import { AssetManager } from "./assets";

export class TileHighlight {
  constructor(assetShorthand, location) {
    this.asset = AssetManager.get(assetShorthand);
    this.location = location;
  }

  drawOnto(target, offsets) {
    target.drawImage(
      this.asset.image,
      0,
      0,
      this.asset.frameSize.width,
      this.asset.frameSize.height,
      this.location.x - offsets.x,
      this.location.y - offsets.y,
      128,
      64
    );
  }
}

export class CursorHighlight extends TileHighlight {
  constructor(location) {
    super("yellowTransparentFullTileHighlight", location);
  }
}

export class SelectedMobileTileHighlight extends TileHighlight {
  constructor(location) {
    super("redTransparentFullTileHighlight", location);
  }
}
