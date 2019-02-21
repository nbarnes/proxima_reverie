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
        asset.image = image;
        imagesRemaining--;
        if (imagesRemaining <= 0) {
          callback();
        }
      };
      image.src = assetDef.imagePath;
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
    this.myImage = document.createElement("canvas");
    this.myImage.width = newImage.width;
    this.myImage.height = newImage.height;
    this.myImage.getContext("2d").drawImage(newImage, 0, 0);
    this.greyscale = document.createElement("canvas");
    this.greyscale.width = newImage.width;
    this.greyscale.height = newImage.height;
    this.greyscale.getContext("2d").drawImage(newImage, 0, 0);

    let greyscalePixels = this.greyscale
      .getContext("2d")
      .getImageData(0, 0, this.greyscale.width, this.greyscale.height);

    for (var y = 0; y < greyscalePixels.height; y++) {
      for (var x = 0; x < greyscalePixels.width; x++) {
        var i = y * 4 * greyscalePixels.width + x * 4;
        var avg =
          (greyscalePixels.data[i] +
            greyscalePixels.data[i + 1] +
            greyscalePixels.data[i + 2]) /
          3;
        greyscalePixels.data[i] = avg;
        greyscalePixels.data[i + 1] = avg;
        greyscalePixels.data[i + 2] = avg;
      }
    }
    this.greyscale
      .getContext("2d")
      .putImageData(
        greyscalePixels,
        0,
        0,
        0,
        0,
        greyscalePixels.width,
        greyscalePixels.height
      );
  }
}
