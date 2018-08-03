'use strict';

import { Assets } from './asset_manager';
import AssetOwner from './asset_owner';
import { entityMapLocationFromTile } from './util';

export default class Entity extends AssetOwner {
  constructor(entityDef, map, brain) {
    super(entityDef.imagePaths);
    this.frameWidth = 60;
    this.frameHeight = 110;
    this.map = map;
    this.currentTile = entityDef.startTile || { x: 0, y: 0 };
    this.location = entityMapLocationFromTile(
      this.currentTile,
      this.map,
      this.frameWidth,
      this.frameHeight
    );
    this.tilePath = [];
    this.brain = brain;
    this.destination = undefined;
  }

  get image() {
    return Assets.get(this.assetPaths[0]);
  }

  get frameXOrigin() {
    return 0;
  }

  get frameYOrigin() {
    return 0;
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
