
"use strict";

import "./styles/index.css";

import loadImages from "./load_images";
import makeMap from "./map";
import { imagePaths } from "./util";
import { Keys } from "./keys";

document.addEventListener("DOMContentLoaded", function() {

  console.log("Proxma Reverie approaches!");

  var viewport = document.getElementById('viewport-canvas');
  var viewportContext = viewport.getContext('2d');
  let viewportWidth = 600, viewportHeight = 400;
  viewport.width = viewportWidth;
  viewport.height = viewportHeight;

  let tileWidth = 128, tileHeight = 64;

  let mapSize = 10;

  let viewOffsetLimitX = (mapSize * tileWidth) - viewportWidth - mapSize;
  let viewOffsetLimitY = (mapSize * tileHeight) - viewportHeight - mapSize;

  viewportContext.fillStyle = 'white';
  viewportContext.fillRect(0, 0, viewportWidth, viewportHeight);

  loadImages(imagePaths, (images) => {
    document.getElementById('loading-images-message').classList.add('hide');
    document.getElementById('images-loaded-message').classList.remove('hide');

    let map = makeMap(mapSize, images, tileWidth, tileHeight);

    setTimeout(() => {
      doTick(map);
    }, 2000);

  });

  let viewOffsetX = ((mapSize * tileWidth - mapSize) / 2) - (viewportWidth / 2);
  let viewOffsetY = ((mapSize * tileHeight - mapSize) / 2) - (viewportHeight / 2);

  function doTick(map) {
    viewportContext.fillRect(0, 0, viewportWidth, viewportHeight);
    viewportContext.drawImage(map, viewOffsetX, viewOffsetY, viewportWidth, viewportHeight, 0, 0, viewportWidth, viewportHeight);
    for (let keyCode of Keys.getKeysPressed()) {
      let newOffset;
      switch (keyCode) {
        case "ArrowLeft":
          newOffset = viewOffsetX - 5;
          if (newOffset < 0) {
            newOffset = 0;
          }
          viewOffsetX = newOffset;
          break;
        case "ArrowRight":
          newOffset = viewOffsetX + 5;
          if (newOffset > viewOffsetLimitX) {
            newOffset = viewOffsetLimitX;
          }
          viewOffsetX = newOffset;
          break;
        case "ArrowUp":
          newOffset = viewOffsetY - 5;
          if (newOffset < 0) {
            newOffset = 0;
          }
          viewOffsetY = newOffset;
          break;
        case "ArrowDown":
          newOffset = viewOffsetY + 5;
          if (newOffset > viewOffsetLimitY) {
            newOffset = viewOffsetLimitY;
          }
          viewOffsetY = newOffset;
          break;
      }
    }
    Keys.resetPresses();

    setTimeout(() => {
      doTick(map);
    }, 25);

  }

  document.addEventListener('keydown', (event) => {
    Keys.keyDown(event.key);
  });

  document.addEventListener('keyup', (event) => {
    Keys.keyUp(event.key);
  });

});
