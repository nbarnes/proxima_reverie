"use strict";

export const ImageManager = (function() {
  let images = {};

  function loadImages(assetOwners, callback) {
    let imagePaths = assetOwners.map(assetOwner => {
      return assetOwner.asset.imagePath;
    });
    imagePaths = [...new Set(imagePaths)];
    let imagesRemaining = imagePaths.length;
    for (let imagePath of imagePaths) {
      let image = new Image();
      images[imagePath] = image;
      image.onload = function() {
        imagesRemaining--;
        if (imagesRemaining <= 0) {
          callback();
        }
      };
      image.src = imagePath;
    }
  }

  function get(imagePath) {
    return images[imagePath];
  }

  return {
    loadImages: loadImages,
    get: get
  };
})();

export class Asset {
  constructor(imagePath, frameSize, frameOffsets) {
    this.imagePath = imagePath;
    this.frameSize = frameSize;
    this.frameOffsets = frameOffsets || { x: 0, y: 0 };
  }

  get image() {
    return ImageManager.get(this.imagePath);
  }
}
