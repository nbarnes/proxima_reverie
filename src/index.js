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
    let d = new Date(),
      timeElapsed = d.getTime() - lastTime;
    let ticksElapsed = Math.floor((timeElapsed + timeRemainder) / tickLength);
    timeRemainder = timeElapsed - ticksElapsed * tickLength;
    scene.tick();
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
