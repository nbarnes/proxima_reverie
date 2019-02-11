"use strict";

import { Input } from "./input";
import Scene from "./scene";

let tickLength = 50;

export class Game {
  constructor() {
    let d = new Date(),
      lastTime = d.getTime(),
      timeRemainder = 0;

    this.gameLoop = () => {
      let d2 = new Date(),
        currentTime = d2.getTime(),
        timeElapsed = currentTime - lastTime;

      Input.resetInputs();
      let ticksElapsed = Math.floor((timeElapsed + timeRemainder) / tickLength);
      if (ticksElapsed > 0) {
        timeRemainder =
          (timeElapsed + timeRemainder) % (ticksElapsed * tickLength);
      } else {
        timeRemainder += timeElapsed;
      }
      lastTime = currentTime;

      this.gameState.handle(ticksElapsed);

      requestAnimationFrame(this.gameLoop);
    };

    this.gameState = new NullGamestate();

    requestAnimationFrame(this.gameLoop);
  }

  changeState(newState) {
    this.gameState.leave();
    newState.enter();
    this.gameState = newState;
  }
}

export class NullGamestate {
  constructor(game) {
    this.game = game;
  }
  handle(ticksElapsed) {}
  leave() {}
  enter() {}
}

export class LoadingSceneGamestate {
  constructor(game, sceneDef, viewport) {
    this.game = game;
    this.loadComplete = false;
    this.scene = new Scene(sceneDef, viewport, () => {
      this.loadComplete = true;
    });
  }
  handle() {
    if (this.loadComplete) {
      this.game.changeState(new AwaitingInputGamestate(this.game, this.scene));
    }
  }
  enter() {}
  leave() {}
}

export class AwaitingInputGamestate {
  constructor(game, scene) {
    this.game = game;
    this.scene = scene;
  }
  handle(ticksElapsed) {
    let keys = Input.getKeysPressed();
    if (keys.length > 0) {
      console.log(keys);
    }
    let mouseActions = Input.getMouseActions();
    if (
      mouseActions.mouseMovedTo != undefined ||
      mouseActions.mouseUpAt != undefined
    ) {
      console.log(mouseActions);
    }
    this.scene.tick(ticksElapsed);
    this.scene.draw();
  }
  leave() {}
  enter() {}
}

export class Autoscrolling_UIState {
  constructor(scroll) {
    this.cameraScroll = scroll;
  }

  tick(ticksElapsed) {}

  handleInputs() {
    let keyInputs = Input.getKeysPressed();
    let mouseInputs = Input.getMouseActions();
  }
}
export class WaitingForInput_UIState {
  constructor(selectedMobile) {
    this.selectedMobile = selectedMobile;
    this.selectedMobileHighlight = undefined;
    this.enter();
  }
  tick(ticksElapsed) {
    this.handleInputs();
    // change camera offsets for manual scroll(?)
  }
  handleInputs() {
    let keyInputs = Input.getKeysPressed();
    let mouseInputs = Input.getMouseActions();
    // handle arrow push -> manual scroll (within state or create ManualScrolling state?)
    // handle mouse movement -> tile highlight

    // handle mouse click -> initiate mobile movement
    //                       change selected mobile
  }
  enter() {
    // place selected mobile highlight
    // place cursor tile highlight
  }
  exit() {
    // remove selected mobile highlight
    // remove cursor tile highlight
  }
}
export class AnimatingMobileMovement_UIState {
  constructor() {}
  tick(ticksElapsed) {
    this.handleInputs();
    // change camera offsets for manual scroll(?)
    // mobile move completed?
  }
  handleInputs() {
    let keyInputs = Input.getKeysPressed();
    let mouseInputs = Input.getMouseActions();
    // handle arrow push -> manual scroll (within state or create ManualScrolling state?)
    // handle mouse movement -> no op
    // handle mouse click -> no op
  }
  enter() {}
  exit() {}
}
