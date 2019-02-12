"use strict";

import { Asset } from "./assets";
import { entityMapLocationFromCell, Facing, coordsEqual } from "./util";

export default class Entity {
  constructor(entityDef, scene, brain) {
    this.asset = new Asset(
      entityDef.imagePath,
      entityDef.frameSize,
      entityDef.frameOffsets
    );
    this.scene = scene;
    if (entityDef.startCell) {
      this.cellLocation = this.scene.map.cellAt(entityDef.startCell);
    } else {
      this.cellLocation = undefined;
    }
    if (this.cellLocation) {
      this.addToCell(this.cellLocation);
    }
    this.myLocation = entityMapLocationFromCell(
      this.cellLocation,
      this.scene.map,
      this.asset.frameOffsets
    );
    this.cellPath = [];
    this.brain = brain;
    this.destination = undefined;
    this.facing = entityDef.facing;
  }

  get location() {
    return this.myLocation;
  }

  set location(newLocation) {
    let newFacing = undefined;
    if (newLocation != undefined && this.myLocation != undefined) {
      if (
        newLocation.x >= this.myLocation.x &&
        newLocation.y >= this.myLocation.y
      ) {
        newFacing = Facing.SOUTHEAST;
      } else if (
        newLocation.x >= this.myLocation.x &&
        newLocation.y <= this.myLocation.y
      ) {
        newFacing = Facing.NORTHEAST;
      } else if (
        newLocation.x <= this.myLocation.x &&
        newLocation.y <= this.myLocation.y
      ) {
        newFacing = Facing.NORTHWEST;
      } else if (
        newLocation.x <= this.myLocation.x &&
        newLocation.y >= this.myLocation.y
      ) {
        newFacing = Facing.SOUTHWEST;
      } else {
        newFacing = Facing.NORTHEAST;
      }
    }
    this.facing = newFacing;
    this.myLocation = newLocation;
  }

  get frameXOrigin() {
    if (this.facing != undefined) {
      return this.facing * this.asset.frameSize.width;
    }
    return 0;
  }

  get frameYOrigin() {
    return 0;
  }

  respondToMouse(eventCell, startCallback, endCallback) {
    if (
      this.activity == undefined &&
      this.brain != undefined &&
      eventCell.pathable()
    ) {
      this.activity = this.brain.getActivity(
        this,
        eventCell,
        startCallback,
        endCallback
      );
    }
  }

  activityDone() {
    this.activity = undefined;
  }

  moveBetweenCells(from, to) {
    this.removeFromCell(from);
    this.addToCell(to);
  }

  addToCell(cell) {
    cell.addContents(this);
    this.cellLocation = cell;
    this.scene.addEntityToDraw(this);
  }

  removeFromCell(cell) {
    cell.removeContents(this);
    this.scene.removeEntityFromDraw(this);
    if (coordsEqual(this.cellLocation, cell)) {
      this.cellLocation = undefined;
    }
  }

  tick(tickCount) {
    let i = 0;
    do {
      if (this.activity != undefined) {
        this.activity();
      }
    } while (i++ < tickCount);
  }

  drawOnto(target, offsets) {
    target.drawImage(
      this.asset.image,
      this.frameXOrigin,
      this.frameYOrigin,
      this.asset.frameSize.width,
      this.asset.frameSize.height,
      this.location.x - offsets.x,
      this.location.y - offsets.y,
      this.asset.frameSize.width,
      this.asset.frameSize.height
    );
  }

  isSelectedMobile() {
    return this.scene.activeMobile === this;
  }
}
