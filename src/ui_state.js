"use strict";

import { Input } from "./input";

export class NullState_UIState {
  constructor() {}
  tick(ticksElapsed) {}
  handleInputs() {}
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
