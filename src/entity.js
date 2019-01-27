"use strict";

import { Assets } from "./asset_manager";
import AssetOwner from "./asset_owner";
import { entityMapLocationFromCell, Facing, coordsEqual } from "./util";

export default class Entity extends AssetOwner {
  constructor(entityDef, scene, brain) {
    super(entityDef.imagePaths);
    this.frameSize = entityDef.frameSize;
    this.frameOffsets = entityDef.frameOffsets || { x: 0, y: 0 };
    this.scene = scene;
    this.cellLocation = this.scene.map.cellAt(
      entityDef.startCell || { x: 0, y: 0 }
    );
    this.addToCell(this.cellLocation);
    this.myLocation = entityMapLocationFromCell(
      this.cellLocation,
      this.scene.map,
      this.frameOffsets
    );
    this.cellPath = [];
    this.brain = brain;
    this.destination = undefined;
    this.facing = entityDef.facing;
  }

  get image() {
    return Assets.get(this.assetPaths[0]);
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
      return this.facing * this.frameSize.width;
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

  isSelectedMobile() {
    return this.scene.activeMobile === this;
  }
}
