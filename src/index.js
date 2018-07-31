'use strict';

import './styles/index.css';

import { Assets } from './asset_manager';
import Tile from './tile';
import Map from './map';
import Entity from './entity';
import { tileImagePaths, mobileSpritePaths } from './util';
import { Input } from './input';

document.addEventListener('DOMContentLoaded', function() {
  console.log('Proxma Reverie approaches!');

  let tickLength = 50;

  var viewport = document.getElementById('viewport-canvas');
  var viewportContext = viewport.getContext('2d');
  let viewportWidth = 600,
    viewportHeight = 400;
  viewport.width = viewportWidth;
  viewport.height = viewportHeight;

  let mapSize = 10;

  // let viewOffsetLimitX = (mapSize * tileWidth) - viewportWidth - mapSize;
  // let viewOffsetLimitY = (mapSize * tileHeight) - viewportHeight - mapSize;

  let tiles = [];
  for (let tileImagePath of tileImagePaths) {
    tiles.push(new Tile([tileImagePath]));
  }
  let map = new Map(tiles, mapSize);
  let mobile = new Entity(mobileSpritePaths, map, {
    x: Math.floor(mapSize / 2),
    y: Math.floor(mapSize / 2)
  });

  Assets.loadAssets([...tiles, mobile], () => {
    document.getElementById('loading-images-message').classList.add('hide');
    document.getElementById('images-loaded-message').classList.remove('hide');

    setTimeout(() => {
      let viewOffsetX = map.mapCanvas.width / 2 - viewportWidth / 2;
      let viewOffsetY = map.mapCanvas.height / 2 - viewportHeight / 2;

      doTick(map, viewOffsetX, viewOffsetY);
    }, tickLength);
  });

  function doTick(map, viewOffsetX, viewOffsetY) {
    // console.log('tick');
    viewportContext.clearRect(0, 0, viewportWidth, viewportHeight);
    viewportContext.drawImage(
      map.mapCanvas,
      viewOffsetX,
      viewOffsetY,
      viewportWidth,
      viewportHeight,
      0,
      0,
      viewportWidth,
      viewportHeight
    );

    let mouseEvent = Input.getMouseEvent();
    if (mouseEvent != undefined) {
      let mapPosition = getCursorMapPosition(
        viewOffsetX,
        viewOffsetY,
        mouseEvent
      );
      let tilePosition = getCursorTilePosition(map, mapPosition);
      // console.log("");
      // console.log(`canvas position: ${mouseEvent.x}, ${mouseEvent.y}`);
      // console.log(`map position: ${mapPosition.x}, ${mapPosition.y}`);
      // console.log(`tile position: ${tilePosition.x}, ${tilePosition.y}`);
      // console.log("");

      mobile.respondToMouse({
        mapCoord: mapPosition,
        tileCoords: tilePosition
      });
    }

    mobile.tick();
    viewportContext.drawImage(
      mobile.image,
      mobile.frameXOrigin,
      mobile.frameYOrigin,
      mobile.frameWidth,
      mobile.frameHeight,
      mobile.location.x - viewOffsetX,
      mobile.location.y - viewOffsetY,
      mobile.frameWidth,
      mobile.frameHeight
    );

    Input.resetInputs();

    setTimeout(() => {
      doTick(map, viewOffsetX, viewOffsetY);
    }, tickLength);
  }

  document.addEventListener('keydown', event => {
    Input.keyDown(event.key);
  });

  document.addEventListener('keyup', event => {
    Input.keyUp(event.key);
  });

  viewport.addEventListener('mouseup', event => {
    Input.mouseUp(getCursorCanvasPosition(viewport, event));
  });

  function getCursorCanvasPosition(canvas, position) {
    let rect = canvas.getBoundingClientRect();
    let x = position.clientX - rect.left;
    let y = position.clientY - rect.top;
    return { x: x, y: y };
  }

  function getCursorMapPosition(viewOffsetX, viewOffsetY, position) {
    let mouseMapX = viewOffsetX + position.x;
    let mouseMapY = viewOffsetY + position.y;
    return { x: mouseMapX, y: mouseMapY };
  }

  function getCursorTilePosition(map, position) {
    let halfTileWidth = map.tileWidth / 2;
    let halfTileHeight = map.tileHeight / 2;
    let halfMapSize = map.mapSize / 2;
    let tileX =
      (position.x / halfTileWidth + position.y / halfTileHeight) / 2 -
      halfMapSize;
    let tileY =
      (position.y / halfTileHeight - position.x / halfTileWidth) / 2 +
      halfMapSize;
    return { x: Math.floor(tileX), y: Math.floor(tileY) };
  }
});
