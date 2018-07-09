
"use strict";

import { rand } from "./util";

export default function makeMap(mapSize, tileImgs, tileWidth, tileHeight) {
  let map = document.createElement("canvas");
  map.width = mapSize * tileWidth - mapSize;
  map.height = mapSize * tileHeight - mapSize;
  drawMap(map.getContext("2d"), buildMapDef(mapSize, tileImgs.length), tileImgs, tileWidth, tileHeight);
  return map;
}

function buildMapDef(mapSize, tileCount) {
  let mapDef = [];
  for (let i = 0; i < mapSize; i++) {
    mapDef[i] = [];
    for (let j = 0; j < mapSize; j++) {
      mapDef[i][j] = rand(tileCount);
    }
  }
  return mapDef;
}

function drawMap(context, mapDef, tileImgs, tileWidth, tileHeight) {
  for (let [x, row] of mapDef.entries()) {
    for (let [y, tileIndex] of row.entries()) {
      drawTile(context, mapDef[0].length, tileImgs[tileIndex], x, y, tileWidth, tileHeight);
    }
  }
}

function drawTile(context, mapSize, img, mapX, mapY, tileWidth, tileHeight) {
  let xOffset = ((mapSize * tileWidth) / 2) - (tileWidth / 2);
  let contextX = ((mapX - mapY) * (tileWidth / 2)) - mapX + xOffset;
  let contextY = (mapX + mapY) * (tileHeight / 2) - mapY;
  console.log(`${contextX}, ${contextY}`);
  context.drawImage(img, contextX, contextY, tileWidth, tileHeight);
}
