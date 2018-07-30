
"use strict";

import { Assets } from "./asset_manager";
import AssetOwner from "./asset_owner";

export default class Entity extends AssetOwner {

  constructor(assetPaths, map, startingXLoc, startingYLoc) {
    super(assetPaths);
    this.frameWidth = 60;
    this.frameHeight = 110;
    this.map = map;
    this.location = {
      x: ((startingXLoc === undefined) ? 0 : startingXLoc),
      y: ((startingYLoc === undefined) ? 0 : startingYLoc)
    };
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

  respondToMouse(event) {
    if (event != undefined) {
      let newDestination = this.mapCoordsWithFrameOffset(this.map.mapCoordsForTile({x: event.tileCoord.x, y: event.tileCoord.y}));
      this.destination = {x: newDestination.x, y: newDestination.y};
    }
  }

  tick() {
    if (this.destination != undefined) {
      let dx = this.location.x - this.destination.x, dy = this.location.y - this.destination.y;
      let dist = Math.sqrt(dx*dx+dy*dy);

      if (dist != 0) {
        let velX = ( dx / dist ) * 5;
        let velY = ( dy / dist ) * 5;

        if (Math.abs(dx) < Math.abs(velX)) {
          velX = dx;
        }
        if (Math.abs(dy) < Math.abs(velY)) {
          velY = dy;
        }

        this.location.x -= velX;
        this.location.y -= velY;
      } else {
        this.destination = undefined;
      }

    }
  }

  mapCoordsWithFrameOffset(mapCoords) {
    // return {x: mapCoords.x - (this.frameWidth / 2), y: mapCoords.y - (this.frameHeight)};
    return {x: mapCoords.x, y: mapCoords.y};
  }

}
