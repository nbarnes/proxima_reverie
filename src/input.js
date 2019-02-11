"use strict";

export const Input = (function() {
  let keysDown = [];
  let keysPressed = [];
  let mouseMovedTo = undefined;
  let mouseUpAt = undefined;

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
    this.mouseMovedTo = event;
  }

  function mouseUp(event) {
    this.mouseUpAt = event;
  }

  function getMouseActions() {
    return { mouseMovedTo: this.mouseMovedTo, mouseUpAt: this.mouseUpAt };
  }

  function resetInputs() {
    keysPressed = [];
    this.mouseMovedTo = undefined;
    this.mouseUpAt = undefined;
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
