"use strict";

import { Input } from "./input";
import Scene from "./scene";
import { lesserOf } from "./util";

let tickLength = 50;
let cameraScrollSpeed = 4;

export class Game {
  constructor() {
    let d = new Date(),
      lastTime = d.getTime(),
      timeRemainder = 0;

    this.gameLoop = () => {
      let d2 = new Date(),
        currentTime = d2.getTime(),
        timeElapsed = currentTime - lastTime;

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
  enter() {}
  leave() {}
}

export class LoadingSceneGamestate {
  constructor(game, sceneDef, viewport) {
    this.game = game;
    this.loadComplete = false;
    this.scene = new Scene(game, sceneDef, viewport, () => {
      this.loadComplete = true;
    });
  }
  handle() {
    if (this.loadComplete) {
      this.game.changeState(new AwaitingInputGamestate(this.game, this.scene));
      this.scene.activateNextMobile();
    }
  }
  enter() {
    document.getElementById("loading-images-message").classList.remove("hide");
    document.getElementById("images-loaded-message").classList.add("hide");
  }
  leave() {
    document.getElementById("loading-images-message").classList.add("hide");
    document.getElementById("images-loaded-message").classList.remove("hide");
  }
}

export class AwaitingInputGamestate {
  constructor(game, scene) {
    this.game = game;
    this.scene = scene;
  }
  handle(ticksElapsed) {
    let keys = Input.getKeysPressed();
    this.handleArrowScroll(keys);
    let mouseActions = Input.getMouseActions();
    // handle arrow push -> manual scroll (within state or create ManualScrolling state?)
    // handle mouse movement -> tile highlight

    // handle mouse click -> initiate mobile movement
    //                       change selected mobile

    Input.resetInputs();
    this.scene.tick(ticksElapsed);
    this.scene.draw();
  }
  enter() {
    // select a mobile?
    // place selected mobile highlight
    // place cursor tile highlight
  }
  leave() {
    // remove selected mobile highlight
    // remove cursor tile highlight
  }
  handleArrowScroll(keys) {
    if (keys.includes("ArrowUp")) {
      this.scene.cameraOffsets.y -= cameraScrollSpeed;
    }
    if (keys.includes("ArrowDown")) {
      this.scene.cameraOffsets.y += cameraScrollSpeed;
    }
    if (keys.includes("ArrowLeft")) {
      this.scene.cameraOffsets.x -= cameraScrollSpeed;
    }
    if (keys.includes("ArrowRight")) {
      this.scene.cameraOffsets.x += cameraScrollSpeed;
    }
  }
}

export class AutoscrollingGameState {
  constructor(game, scene, scrollTrack) {
    this.game = game;
    this.scene = scene;
    this.scrollTrack = scrollTrack;
  }

  handle(ticksElapsed) {
    if (Input.getKeysPressed().length > 0 || this.scrollTrack.length == 0) {
      this.game.changeState(new AwaitingInputGamestate(this.game, this.scene));
      Input.resetInputs();
    } else {
      if (ticksElapsed > 0) {
        let scrollDistance = lesserOf(
          ticksElapsed * 10,
          this.scrollTrack.length
        );
        this.scrollTrack = this.scrollTrack.slice(scrollDistance - 1);
        let newLoc = this.scrollTrack.shift();
        this.scene.cameraOffsets = newLoc;
        this.scene.tick(ticksElapsed);
        this.scene.draw();
      }
    }
  }
  enter() {}
  leave() {}
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
