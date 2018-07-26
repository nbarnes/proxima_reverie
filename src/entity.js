
"use strict";

import { Assets } from "./asset_manager";
import Loadable from "./asset_owner";

export default class Entity extends Loadable {

  constructor(assetPaths, startingXLoc, startingYLoc) {
    super(assetPaths);
    this.frameWidth = 60;
    this.frameHeight = 110;
    this.location = {
      x: ((startingXLoc === undefined) ? 0 : startingXLoc),
      y: ((startingYLoc === undefined) ? 0 : startingYLoc)
    };
    this.destination = undefined;
  }

  loadComplete() {}

  get image() {
    return Assets.get(this.assetPaths[0]);
  }

  get frameXOrigin() {
    return 0;
  }

  get frameYOrigin() {
    return 0;
  }

  respondToMouse(event) {
    this.destination = {x: event.x, y: event.y};
  }

  tick() {
    if (this.destination != undefined) {
      let dx = this.location.x - this.destination.x, dy = this.location.y - this.destination.y;
      let dist = Math.sqrt(dx*dx+dy*dy);

      let velX = ( dx / dist) * 5;
      let velY = ( dy / dist ) * 5;

      this.location.x -= velX;
      this.location.y -= velY;
    }
  }

}
