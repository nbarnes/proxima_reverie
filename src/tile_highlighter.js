"use strict";

import { Assets } from "./asset_manager";
import { PubSub } from "./pub_sub";
import { mapCoordsForCell } from "./util";

const TileHighlightPaths = [
  "./src/img/tile_highlights/black_outline_blur.png",
  "./src/img/tile_highlights/black_outline.png",
  "./src/img/tile_highlights/red_outline.png",
  "./src/img/tile_highlights/red_transparent_full_tile.png",
  "./src/img/tile_highlights/yellow_transparent_full_tile.png"
];

export const TileHighlighter = (function() {
  let activeMobileHighlight = undefined;
  let cursorHighlight = undefined;
  let inputDisabled = false;

  function draw(context, viewportOffsets, tileSize) {
    if (!inputDisabled) {
      if (cursorHighlight != undefined) {
        cursorHighlight.draw(context, viewportOffsets, tileSize);
      }
      if (activeMobileHighlight != undefined) {
        activeMobileHighlight.draw(context, viewportOffsets, tileSize);
      }
    }
  }

  PubSub.subscribe("activeMobileChanged", data => {
    activeMobileHighlight = new TileHighlight(
      "./src/img/tile_highlights/red_transparent_full_tile.png",
      mapCoordsForCell(data.mobile.cellLocation, data.map)
    );
  });

  PubSub.subscribe("inputBlockingActivityStarted", () => {
    inputDisabled = true;
  });

  PubSub.subscribe("inputBlockingActivityFinished", () => {
    inputDisabled = false;
  });

  PubSub.subscribe("mouseOverCell", data => {
    cursorHighlight = new TileHighlight(
      "./src/img/tile_highlights/yellow_transparent_full_tile.png",
      mapCoordsForCell(data.cellLocation, data.map)
    );
  });

  return {
    draw: draw,
    assetPaths: TileHighlightPaths
  };
})();

export class TileHighlight {
  constructor(highlightAssetPath, cellLocation) {
    this.highlightAssetPath = highlightAssetPath;
    this.cellLocation = cellLocation;
  }
  draw(context, viewportOffsets, tileSize) {
    let asset = Assets.get(this.highlightAssetPath);
    context.drawImage(
      asset,
      0,
      0,
      asset.width,
      asset.height,
      this.cellLocation.x - viewportOffsets.x,
      this.cellLocation.y - viewportOffsets.y,
      tileSize.x,
      tileSize.y
    );
  }
}
