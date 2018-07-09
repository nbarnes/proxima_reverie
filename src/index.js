
"use strict";

import "./styles/index.css";

import loadImages from "./load_images";

document.addEventListener("DOMContentLoaded", function() {

  console.log("Proxma Reverie approaches!");

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  let tileWidth = 128, tileHeight = 64;
  let canvasWidth = 600, canvasHeight = 400;
  let canvasXOffset = (canvasWidth / 2) - (tileWidth / 2);

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context.fillStyle = 'white';
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  let tilePngs = [
    '/src/img/ground_tiles/brickpavers2.png',
    '/src/img/ground_tiles/concrete368a.png',
    '/src/img/ground_tiles/cretebrick970.png',
    '/src/img/ground_tiles/dirt.png',
    '/src/img/ground_tiles/dirtsand2.png',
    '/src/img/ground_tiles/rock.png',
    '/src/img/ground_tiles/snow.png',
    '/src/img/ground_tiles/stone.png'
  ];

  loadImages(tilePngs, (images) => {
    document.getElementById('loading-images-message').classList.add('hide');
    document.getElementById('images-loaded-message').classList.remove('hide');

    for (let tileImage of images) {
      document.body.appendChild(tileImage);
    }

    let tileMap = buildTileMap(images.length);

    drawTileMap(tileMap, images);

  });

  function drawTileMap(tileMap, tileImages) {
    for (let [x, row] of tileMap.entries()) {
      for (let [y, tileIndex] of row.entries()) {
        drawTile(tileImages[tileIndex], x, y);
      }
    }
  }

  function drawTile(img, mapX, mapY) {
    let canvasX = ((mapX - mapY) * (tileWidth / 2)) + canvasXOffset;
    let canvasY = (mapX + mapY) * (tileHeight / 2);
    console.log(`${canvasX}, ${canvasY}`);
    context.drawImage(img, canvasX, canvasY, tileWidth, tileHeight);
  }

  function buildTileMap(tileCount) {
    return [
      [
        rand(tileCount),
        rand(tileCount),
        rand(tileCount),
        rand(tileCount)
      ], [
        rand(tileCount),
        rand(tileCount),
        rand(tileCount),
        rand(tileCount)
      ], [
        rand(tileCount),
        rand(tileCount),
        rand(tileCount),
        rand(tileCount)
      ], [
        rand(tileCount),
        rand(tileCount),
        rand(tileCount),
        rand(tileCount)
      ]
    ]
  }

  function rand(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

});
