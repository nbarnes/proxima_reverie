'use strict';

import { Assets } from './asset_manager';
import { PubSub } from './pub_sub';

const TileHighlightPaths = [
  './src/img/tile_highlights/black_outline_blur.png',
  './src/img/tile_highlights/black_outline.png',
  './src/img/tile_highlights/red_outline.png',
  './src/img/tile_highlights/red_transparent_full_tile.png',
  './src/img/tile_highlights/yellow_transparent_full_tile.png'
];

export const TileHighlighter = (function() {
  let activeMobileHighlight = undefined;
  let cursorHighlight = undefined;

  function mouseAt(map, cellLocation) {
    cursorHighlight = new TileHighlight(
      './src/img/tile_highlights/yellow_transparent_full_tile.png',
      map.mapCoordsForCell(cellLocation)
    );
  }

  function draw(context, viewportOffsets, tileSize) {
    if (cursorHighlight != undefined) {
      cursorHighlight.draw(context, viewportOffsets, tileSize);
    }
    if (activeMobileHighlight != undefined) {
      activeMobileHighlight.draw(context, viewportOffsets, tileSize);
    }
  }

  PubSub.subscribe('activeMobileChanged', data => {
    activeMobileHighlight = new TileHighlight(
      './src/img/tile_highlights/red_transparent_full_tile.png',
      data.map.mapCoordsForCell(data.mobile.cellLocation)
    );
  });

  PubSub.subscribe('mobileMoveStarted', () => {
    cursorHighlight = undefined;
    activeMobileHighlight = undefined;
  });

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
