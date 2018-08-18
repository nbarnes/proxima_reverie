'use strict';

export const Input = (function() {
  let keysDown = [];
  let keysPressed = [];
  let mouseUpEvent = undefined;
  let mouseMovedEvent = undefined;

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
    mouseUpEvent = event;
  }

  function mouseMoved(event) {
    mouseMovedEvent = event;
  }

  function getMouseUpEvent() {
    return mouseUpEvent;
  }

  function getMouseMovedEvent() {
    return mouseMovedEvent;
  }

  function resetInputs() {
    keysPressed = [];
    mouseUpEvent = undefined;
    mouseMovedEvent = undefined;
  }

  return {
    keyDown: keyDown,
    keyUp: keyUp,
    getKeysPressed: getKeysPressed,
    mouseUp: mouseUp,
    mouseMoved: mouseMoved,
    getMouseUpEvent: getMouseUpEvent,
    getMouseMovedEvent: getMouseMovedEvent,
    resetInputs: resetInputs
  };
})();
