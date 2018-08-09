'use strict';

import { Assets } from './asset_manager';
import AssetOwner from './asset_owner';
import { entityMapLocationFromCell, Facing } from './util';

export default class Entity extends AssetOwner {
  constructor(entityDef, map, brain) {
    super(entityDef.imagePaths);
    this.frameSize = entityDef.frameSize;
    this.frameOffsets = entityDef.frameOffsets || { x: 0, y: 0 };
    this.map = map;
    this.currentCell = this.map.cellAt(entityDef.startCell || { x: 0, y: 0 });
    this.myLocation = entityMapLocationFromCell(
      this.currentCell,
      this.map,
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
    // console.log(this.myLocation);
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

  respondToMouse(eventCell, blockingAnimationCallback) {
    if (this.activity == undefined) {
      this.activity = this.brain.getActivity(
        this,
        eventCell,
        blockingAnimationCallback
      );
    }
  }

  activityDone() {
    this.activity = undefined;
  }

  tick() {
    if (this.activity != undefined) {
      this.activity();
    }
  }
}
