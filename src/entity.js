"use strict";

import { AssetManager } from "./assets";
import { entityMapLocationFromCell, Facing, coordsEqual } from "./util";

export default class Entity {
  constructor(entityDef, scene) {
    this.asset = AssetManager.get(entityDef.assetShorthand);
    this.scene = scene;
    if (entityDef.startCell) {
      this.cellLocation = this.scene.map.cellAt(entityDef.startCell);
    }
    if (this.cellLocation) {
      this.addToCell(this.cellLocation);
    }
    this.myLocation = entityMapLocationFromCell(
      this.cellLocation,
      this.scene.map,
      this.asset.frameOffsets
    );
    this.myShouldGreyscale = false;
    this.cellPath = [];
    this.facing = entityDef.facing;
  }

  get brain() {
    return this.myBrain;
  }

  set brain(newBrain) {
    this.myBrain = newBrain;
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

  respondToMoveCommand(eventCell, startCallback, endCallback) {
    if (
      this.activity == undefined &&
      this.brain != undefined &&
      eventCell.pathable()
    ) {
      this.activity = this.myBrain.getActivity(
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
    let assetImage = this.asset.image;
    if (this.myShouldGreyscale) {
      assetImage = this.asset.greyscale;
    }
    target.drawImage(
      assetImage,
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

  get greyscale() {
    return this.myShouldGreyscale;
  }

  set greyscale(newGreyscale) {
    this.myShouldGreyscale = newGreyscale;
  }

  isSelectedMobile() {
    return this.scene.activeMobile === this;
  }
}
