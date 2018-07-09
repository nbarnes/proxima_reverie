
"use strict";

import "./styles/index.css";

import loadImages from "./load_images";
import makeMap from "./map";
import { imagePaths } from "./util";

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

    document.body.appendChild(map);

    viewportContext.drawImage(map, 0, 0, viewportWidth, viewportHeight, 0, 0, viewportWidth, viewportHeight);

  });



});
