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

  let d = new Date(),
    lastTime = d.getTime(),
    timeRemainder = 0;
  let loop = () => {
    let d2 = new Date(),
      currentTime = d2.getTime(),
      timeElapsed = currentTime - lastTime;
    let ticksElapsed = Math.floor((timeElapsed + timeRemainder) / tickLength);
    if (ticksElapsed > 0) {
      timeRemainder =
        (timeElapsed + timeRemainder) % (ticksElapsed * tickLength);
    } else {
      timeRemainder += timeElapsed;
    }
    lastTime = currentTime;
    scene.tick(ticksElapsed);
    requestAnimationFrame(loop);
  };

  let scene = new Scene(sceneDef, viewport, viewportDimensions, () => {
    requestAnimationFrame(loop);
  });

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
