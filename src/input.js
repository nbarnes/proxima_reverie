
"use strict";

export const Input = (function() {

  let keysDown = [];
  let keysPressed = [];
  let mouseEventPoint = undefined;

  function keyDown(keyCode) {
    if (keysPressed.indexOf(keyCode) < 0) {
      keysPressed.push(keyCode);
    }
    if (keysDown.indexOf(keyCode) < 0) {
      keysDown.push(keyCode);
    }
  }

  function keyUp(keyCode) {
    keysDown = keysDown.filter( (element) => {
      return element != keyCode;
    });
  }

  function getKeysPressed() {
    return keysDown.concat(keysPressed.filter( (key) => {
      return keysDown.indexOf(key) < 0;
    }));
  }

  function mouseUp(point) {
    mouseEventPoint = point;
  }

  function getMouseEvent() {
    return mouseEventPoint;
  }

  function resetInputs() {
    keysPressed = [];
    mouseEventPoint = undefined;
  }

  return {
    keyDown: keyDown,
    keyUp: keyUp,
    getKeysPressed: getKeysPressed,
    mouseUp: mouseUp,
    getMouseEvent: getMouseEvent,
    resetInputs: resetInputs
  }

})();
