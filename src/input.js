"use strict";

export const Input = (function() {
  let keysDown = [];
  let keysPressed = [];
  let mouseMoved = undefined;
  let mouseUped = undefined;

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

  function mouseMove(event) {
    mouseMoved = event;
  }

  function mouseUp(event) {
    mouseUped = event;
  }

  function getMouseActions() {
    return { mouseMove: mouseMoved, mouseUp: mouseUped };
  }

  function resetInputs() {
    keysPressed = [];
    mouseMoved = undefined;
    mouseUped = undefined;
  }

  return {
    keyDown: keyDown,
    keyUp: keyUp,
    getKeysPressed: getKeysPressed,
    mouseMove: mouseMove,
    mouseUp: mouseUp,
    getMouseActions: getMouseActions,
    resetInputs: resetInputs
  };
})();
