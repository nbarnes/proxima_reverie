'use strict';

export const Input = (function() {
  let keysDown = [];
  let keysPressed = [];
  let mouseEvent = undefined;

  function keyDown(keyCode) {
    if (keysPressed.indexOf(keyCode) < 0) {
      keysPressed.push(keyCode);
    }
    if (keysDown.indexOf(keyCode) < 0) {
      keysDown.push(keyCode);
    }
  }

  function keyUp(keyCode) {
    keysDown = keysDown.filter(element => {
      return element != keyCode;
    });
  }

  function getKeysPressed() {
    return keysDown.concat(
      keysPressed.filter(key => {
        return keysDown.indexOf(key) < 0;
      })
    );
  }

  function mouseUp(event) {
    mouseEvent = event;
  }

  function getMouseEvent() {
    return mouseEvent;
  }

  function resetInputs() {
    keysPressed = [];
    mouseEvent = undefined;
  }

  return {
    keyDown: keyDown,
    keyUp: keyUp,
    getKeysPressed: getKeysPressed,
    mouseUp: mouseUp,
    getMouseEvent: getMouseEvent,
    resetInputs: resetInputs
  };
})();
