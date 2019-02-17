"use strict";

import { GlobalAssets } from "./global_assets";

export const AssetManager = (function() {
  let assets = {};

  function loadAssets(assetDefs, callback) {
    assetDefs = assetDefs.concat(GlobalAssets);
    let imagePaths = assetDefs.map(assetDef => {
      return assetDef.imagePath;
    });
    imagePaths = [...new Set(imagePaths)];
    let imagesRemaining = imagePaths.length;
    for (let assetDef of assetDefs) {
      let asset = new Asset(assetDef);
      assets[assetDef.shorthand] = asset;
      let image = new Image();
      image.onload = function() {
        imagesRemaining--;
        if (imagesRemaining <= 0) {
          callback();
        }
      };
      image.src = assetDef.imagePath;
      asset.image = image;
    }
  }

  function get(assetShorthand) {
    return assets[assetShorthand];
  }

  return {
    loadAssets: loadAssets,
    get: get
  };
})();

export class Asset {
  constructor(assetDef) {
    this.shorthand = assetDef.shorthand;
    this.imagePath = assetDef.imagePath;
    this.frameSize = assetDef.frameSize;
    this.frameOffsets = assetDef.frameOffsets || { x: 0, y: 0 };
  }

  get image() {
    return this.myImage;
  }

  set image(newImage) {
    this.myImage = newImage;
  }
}
