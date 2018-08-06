'use strict';

import { Assets } from './asset_manager';
import AssetOwner from './asset_owner';
import { entityMapLocationFromTile, Facing } from './util';

export default class Entity extends AssetOwner {
  constructor(entityDef, map, brain) {
    super(entityDef.imagePaths);
    this.frameSize = entityDef.frameSize;
    this.frameOffsets = entityDef.frameOffsets || { x: 0, y: 0 };
    this.map = map;
    this.currentTile = entityDef.startTile || { x: 0, y: 0 };
    this.myLocation = entityMapLocationFromTile(
      this.currentTile,
      this.map,
      this.frameOffsets
    );
    this.tilePath = [];
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
        console.log('Error in facing alg in Entity; this should never happen');
        newFacing = Facing.NORTHEAST;
      }
    }
    this.facing = newFacing;
    this.myLocation = newLocation;
  }

  respondToMouse(eventTile, blockingAnimationCallback) {
    if (this.activity == undefined) {
      this.activity = this.brain.getActivity(
        this,
        eventTile,
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
