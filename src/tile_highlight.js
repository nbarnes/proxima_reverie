"use strict";

import { Asset } from "./assets";

export const TileHighlightDefs = [
  {
    imagePath: "./src/img/tile_highlights/black_outline_blur.png",
    frameSize: { width: 512, height: 256 },
    frameOffsets: { x: 0, y: 0 }
  },
  {
    imagePath: "./src/img/tile_highlights/black_outline.png",
    frameSize: { width: 512, height: 256 },
    frameOffsets: { x: 0, y: 0 }
  },
  {
    imagePath: "./src/img/tile_highlights/red_outline.png",
    frameSize: { width: 512, height: 256 },
    frameOffsets: { x: 0, y: 0 }
  },
  {
    imagePath: "./src/img/tile_highlights/red_transparent_full_tile.png",
    frameSize: { width: 512, height: 256 },
    frameOffsets: { x: 0, y: 0 }
  },
  {
    imagePath: "./src/img/tile_highlights/yellow_transparent_full_tile.png",
    frameSize: { width: 512, height: 256 },
    frameOffsets: { x: 0, y: 0 }
  }
];

export class TileHighlight {
  constructor(highlightDef, location) {
    this.asset = new Asset(
      highlightDef.imagePath,
      highlightDef.frameSize,
      highlightDef.frameOffsets
    );
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
    super(TileHighlightDefs[4], location);
  }
}

export class SelectedMobileTileHighlight extends TileHighlight {
  constructor(location) {
    super(TileHighlightDefs[3], location);
  }
}
