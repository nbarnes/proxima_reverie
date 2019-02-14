"use strict";

export const Input = (function() {
  let keysDown = [];
  let keysPressed = [];
  let mouseAt = undefined;
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

  function getKeys() {
    return keysDown.concat(
      keysPressed.filter(key => {
        return keysDown.indexOf(key) < 0;
      })
    );
  }

  function mouseMove(event) {
    mouseAt = event;
    mouseMoved = event;
  }

  function mouseUp(event) {
    mouseUped = event;
  }

  function getMouse() {
    return { mouseAt: mouseAt, mouseMove: mouseMoved, mouseUp: mouseUped };
  }

  // Usually called after the inputs are polled; does not reset mouseAt
  function resetInputs() {
    keysPressed = [];
    mouseMoved = undefined;
    mouseUped = undefined;
  }

  return {
    keyDown: keyDown,
    keyUp: keyUp,
    getKeys: getKeys,
    mouseMove: mouseMove,
    mouseUp: mouseUp,
    getMouse: getMouse,
    resetInputs: resetInputs
  };
})();
