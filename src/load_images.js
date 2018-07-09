
"use strict";

export default function loadImages(imagePaths, callback) {
  let imagesRemaining = imagePaths.length;
  let images = [];
  for (let imagePath of imagePaths) {
    let img = new Image();
    img.onload = function() {
      imagesRemaining--;
      if (imagesRemaining <= 0) {
        callback(images);
      }
    };
    img.src = imagePath;
    images.push(img);
  }
}
