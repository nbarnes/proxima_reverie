
"use strict";

import { rand } from "./util";
import { Assets } from "./asset_manager";
import AssetOwner from "./asset_owner";

export default class Map extends AssetOwner {

  constructor(tileImagePaths, mapSize, tileWidth, tileHeight) {
    super(tileImagePaths);
    this.mapSize = mapSize;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.mapDef = buildMapDef(this);
  }

  loadComplete() {
    this.mapImage = drawMap(this);
  }

};

function buildMapDef(map) {
  let mapDef = [];
  for (let i = 0; i < map.mapSize; i++) {
    mapDef[i] = [];
    for (let j = 0; j < map.mapSize; j++) {
      mapDef[i][j] = map.assetPaths[rand(map.assetPaths.length)];
    }
  }
  return mapDef;
}

function drawMap(map) {
  let mapCanvas = document.createElement("canvas");
  mapCanvas.width = map.mapSize * map.tileWidth - map.mapSize;
  mapCanvas.height = map.mapSize * map.tileHeight - map.mapSize;

  for (let [x, row] of map.mapDef.entries()) {
    for (let [y, tilePath] of row.entries()) {
      drawTile(map, mapCanvas.getContext("2d"), Assets.get(tilePath), x, y);
    }
  }
  return mapCanvas;
}

function drawTile(map, context, img, mapX, mapY) {
  let xOffset = ((map.mapSize * map.tileWidth) / 2) - (map.tileWidth / 2);
  let contextX = ((mapX - mapY) * (map.tileWidth / 2)) - mapX + xOffset;
  let contextY = (mapX + mapY) * (map.tileHeight / 2) - mapY;
  context.drawImage(img, contextX, contextY, map.tileWidth, map.tileHeight);
}
