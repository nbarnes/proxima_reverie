
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

  let mapSize = 20;

  let viewportLimitX = (mapSize * tileWidth) - viewportWidth;
  let viewportLimitY = (mapSize * tileHeight) - viewportHeight;

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
    console.log(`${viewOffsetX}, ${viewOffsetY}`);
    viewportContext.drawImage(map, viewOffsetX, viewOffsetY, viewportWidth, viewportHeight, 0, 0, viewportWidth, viewportHeight);
    console.log(`keys pressed at tick = ${Keys.getKeysPressed()}`);
    for (let keyCode of Keys.getKeysPressed()) {
      console.log(keyCode);
      switch (keyCode) {
        case "ArrowLeft":
          viewOffsetX = viewOffsetX + 5;
          break;
        case "ArrowRight":
          viewOffsetX = viewOffsetX - 5;
          break;
        case "ArrowUp":
          viewOffsetY = viewOffsetY - 5;
          break;
        case "ArrowDown":
          viewOffsetY = viewOffsetY + 5;
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
