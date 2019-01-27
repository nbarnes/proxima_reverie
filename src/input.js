"use strict";

export const Input = (function() {
  let keysDown = [];
  let keysPressed = [];

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

  function resetInputs() {
    keysPressed = [];
  }

  return {
    keyDown: keyDown,
    keyUp: keyUp,
    getKeysPressed: getKeysPressed,
    resetInputs: resetInputs
  };
})();
