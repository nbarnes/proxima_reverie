
"use strict";

import "./styles/index.css";

import { Assets } from "./asset_manager.js";
import Map from "./map.js";
import Entity from "./entity.js";
import { tileImagePaths, mobileSpritePath } from "./util";
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

  let map = new Map(tileImagePaths, mapSize, tileWidth, tileHeight);
  let mobile = new Entity(mobileSpritePath);

  Assets.loadAssets([map, mobile], () => {

    document.getElementById('loading-images-message').classList.add('hide');
    document.getElementById('images-loaded-message').classList.remove('hide');

    setTimeout(() => {
      doTick(map);
    }, 500);

  });

  let viewOffsetX = ((mapSize * tileWidth - mapSize) / 2) - (viewportWidth / 2);
  let viewOffsetY = ((mapSize * tileHeight - mapSize) / 2) - (viewportHeight / 2);

  let mobilePosX = viewportWidth / 2;
  let mobilePosY = viewportHeight / 2;

  function doTick(map) {
    console.log('tick');
    viewportContext.fillRect(0, 0, viewportWidth, viewportHeight);
    viewportContext.drawImage(map.mapImage, viewOffsetX, viewOffsetY, viewportWidth, viewportHeight, 0, 0, viewportWidth, viewportHeight);

    for (let keyCode of Keys.getKeysPressed()) {
      console.log(Keys.getKeysPressed());
      switch (keyCode) {
        case "ArrowLeft":
          mobilePosX = mobilePosX - 3;
          break;
        case "ArrowRight":
          mobilePosX = mobilePosX + 3;
          break;
        case "ArrowUp":
          mobilePosY = mobilePosY - 3;
          break;
        case "ArrowDown":
          mobilePosY = mobilePosY + 3;
          break;
      }
    }
    Keys.resetPresses();

    let mobileFrameWidth = 60;
    let mobileFrameHeight = 110;
    viewportContext.drawImage(mobile.image, 0, 0, mobileFrameWidth, mobileFrameHeight, mobilePosX, mobilePosY, mobileFrameWidth, mobileFrameHeight);

    setTimeout(() => {
      doTick(map);
    }, 500);

  }

  document.addEventListener('keydown', (event) => {
    Keys.keyDown(event.key);
  });

  document.addEventListener('keyup', (event) => {
    Keys.keyUp(event.key);
  });

});
