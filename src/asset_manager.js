'use strict';

export const Assets = (function() {
  let assets = {};

  function loadAssets(assetOwners, callback) {
    let tempAssetPaths = [];
    for (let assetOwner of assetOwners) {
      if (assetOwner.constructor.name == 'String') {
        console.log(
          'A string has been passed to Assets.loadAssets instead of an AssetOwner'
        );
      } else if (assetOwner.constructor.name == 'Array') {
        console.log(
          'An array has been passed to Assets.loadAssets instead of an AssetOwner'
        );
      }
      tempAssetPaths = tempAssetPaths.concat(assetOwner.assetPaths);
    }
    let assetPaths = [...new Set(tempAssetPaths)];

    let assetsRemaining = assetPaths.length;
    for (let assetPath of assetPaths) {
      let asset = new Image();
      asset.onload = function() {
        assets[assetPath] = asset;
        assetsRemaining--;
        if (assetsRemaining <= 0) {
          callback();
        }
      };
      asset.src = assetPath;
    }
  }

  function get(assetPath) {
    return assets[assetPath];
  }

  return {
    loadAssets: loadAssets,
    get: get
  };
})();
