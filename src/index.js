
"use strict";

import "./styles/index.css";

/* import { foo } from "./foo"; */

document.addEventListener("DOMContentLoaded", function() {

  console.log("Proxma Reverie approaches!");

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  let tileImgs = [ loadTile('/src/img/ground_tiles/brickpavers2.png'),
                   loadTile('/src/img/ground_tiles/concrete368a.png'),
                   loadTile('/src/img/ground_tiles/cretebrick970.png'),
                   loadTile('/src/img/ground_tiles/dirt.png'),
                   loadTile('/src/img/ground_tiles/dirtsand2.png'),
                   loadTile('/src/img/ground_tiles/rock.png'),
                   loadTile('/src/img/ground_tiles/snow.png'),
                   loadTile('/src/img/ground_tiles/stone.png')
                 ]

  let tileMap = buildTileMap();

  let tileWidth = 64, tileHeight = 32;
  let canvasWidth = 600, canvasHeight = 400;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context.fillStyle = 'white';
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  for (let tile of tileImgs) {
    document.body.appendChild(tile);
  }

  drawTileMap();

  function drawTileMap() {
    for (let [x, row] of tileMap.entries()) {
      for (let [y, tile] of row.entries()) {
        drawTile(tile, x, y);
      }
    }
  }

  function drawTile(img, tileX, tileY) {
    let canvasX = (tileWidth * tileX) + ( (tileX % 2) * (tileWidth / 2) );
    let canvasY = (tileHeight * tileY);
    console.log(`${canvasX}, ${canvasY}`);
    context.drawImage(img, canvasX, canvasY, tileHeight, tileWidth);
  }

  function buildTileMap() {
    return [
      [
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)]
      ], [
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)]
      ], [
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)]
      ], [
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)],
        tileImgs[getRandomInt(4)]
      ]
    ]
  }

  function loadTile(fileName) {
    let img = new Image();
    img.src = fileName;
    return img;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

});
