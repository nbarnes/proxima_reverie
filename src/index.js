
"use strict";

import "./styles/index.css";

import { Assets } from "./asset_manager";
import Map from "./map";
import Entity from "./entity";
import { tileImagePaths, mobileSpritePath } from "./util";
import { Input } from "./input";

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

  let map = new Map(tileImagePaths, mapSize, tileWidth, tileHeight);
  let mobile = new Entity(mobileSpritePath, viewportWidth / 2, viewportHeight / 2);

  Assets.loadAssets([map, mobile], () => {

    document.getElementById('loading-images-message').classList.add('hide');
    document.getElementById('images-loaded-message').classList.remove('hide');

    setTimeout(() => {
      doTick(map);
    }, 500);

  });

  let viewOffsetX = ((mapSize * tileWidth - mapSize) / 2) - (viewportWidth / 2);
  let viewOffsetY = ((mapSize * tileHeight - mapSize) / 2) - (viewportHeight / 2);

  function doTick(map) {
    // console.log('tick');
    viewportContext.clearRect(0, 0, viewportWidth, viewportHeight);
    viewportContext.drawImage(map.mapImage, viewOffsetX, viewOffsetY, viewportWidth, viewportHeight, 0, 0, viewportWidth, viewportHeight);

    let mouseEvent = Input.getMouseEvent();
    if (mouseEvent != undefined) {
      mobile.respondToMouse(mouseEvent);
    }

    mobile.tick();

    viewportContext.drawImage(
      mobile.image,
      mobile.frameXOrigin, mobile.frameYOrigin,
      mobile.frameWidth, mobile.frameHeight,
      mobile.location.x, mobile.location.y,
      mobile.frameWidth, mobile.frameHeight
    );

    Input.resetInputs();

    setTimeout(() => {
      doTick(map);
    }, 500);

  }

  document.addEventListener('keydown', (event) => {
    Input.keyDown(event.key);
  });

  document.addEventListener('keyup', (event) => {
    Input.keyUp(event.key);
  });

  viewport.addEventListener('mouseup', (event) => {
    Input.mouseUp(getCursorPosition(viewport, event));
  });

  function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return {x: x, y: y};
  }

});
