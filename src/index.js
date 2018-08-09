'use strict';

import './styles/index.css';

import { Input } from './input';
import Scene from './scene';
import { sceneDef } from './scene_definition';
import { BinaryHeap } from './binary_heap';

document.addEventListener('DOMContentLoaded', function() {
  console.log('Proxma Reverie approaches!');

  // console.log('testing BinaryHeap');
  // let heap = new BinaryHeap(
  //   el => {
  //     return el;
  //   },
  //   (a, b) => {
  //     return a == b;
  //   }
  // );
  // for (let entry of [10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5]) {
  //   heap.push(entry);
  // }
  // heap.remove(2);
  // while (heap.size() > 0) {
  //   console.log(heap.pop());
  // }

  let tickLength = 20;

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
});
