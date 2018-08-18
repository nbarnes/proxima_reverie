'use strict';

import { Assets } from './asset_manager';

const TileHighlightPaths = [
  './src/img/tile_highlights/black_outline_blur.png',
  './src/img/tile_highlights/black_outline.png',
  './src/img/tile_highlights/red_outline.png',
  './src/img/tile_highlights/red_transparent_full_tile.png',
  './src/img/tile_highlights/yellow_transparent_full_tile.png'
];

export const TileHighlighter = (function() {
  let tileHighlight = undefined;
  function mouseAt(map, cellLocation) {
    tileHighlight = new TileHighlight(
      './src/img/tile_highlights/yellow_transparent_full_tile.png',
      map.mapCoordsForCell(cellLocation)
    );
  }

  function draw(context, viewportOffsets, tileSize) {
    if (tileHighlight != undefined) {
      tileHighlight.draw(context, viewportOffsets, tileSize);
    }
  }

  return {
    mouseAt: mouseAt,
    draw: draw,
    assetPaths: TileHighlightPaths
  };
})();

export class TileHighlight {
  constructor(highlightAssetPath, mapLocation) {
    this.highlightAssetPath = highlightAssetPath;
    this.mapLocation = mapLocation;
  }
  draw(context, viewportOffsets, tileSize) {
    let asset = Assets.get(this.highlightAssetPath);
    context.drawImage(
      asset,
      0,
      0,
      asset.width,
      asset.height,
      this.mapLocation.x - viewportOffsets.x,
      this.mapLocation.y - viewportOffsets.y,
      tileSize.x,
      tileSize.y
    );
  }
}
