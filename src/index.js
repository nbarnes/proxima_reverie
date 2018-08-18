'use strict';

import './styles/index.css';

import { Input } from './input';
import Scene from './scene';
import { sceneDef } from './scene_definition';
import { throttle } from './util';

document.addEventListener('DOMContentLoaded', function() {
  console.log('Proxma Reverie approaches!');

  let tickLength = 50;

  var viewport = document.getElementById('viewport-canvas');
  let viewportDimensions = { x: 600, y: 400 };
  viewport.width = viewportDimensions.x;
  viewport.height = viewportDimensions.y;

  let scene = new Scene(sceneDef, viewport, viewportDimensions, () => {
    setTimeout(() => {
      tick();
    }, 0);
  });

  function tick() {
    scene.tick();
    setTimeout(() => {
      tick();
    }, tickLength);
  }

  document.addEventListener('keydown', event => {
    Input.keyDown(event.key);
  });

  document.addEventListener('keyup', event => {
    Input.keyUp(event.key);
  });

  viewport.addEventListener('mouseup', event => {
    Input.mouseUp(event);
  });

  viewport.addEventListener(
    'mousemove',
    throttle(event => {
      Input.mouseMoved(event);
    }, 50)
  );
});
