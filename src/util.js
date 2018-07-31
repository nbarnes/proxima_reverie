'use strict';

export const tileImagePaths = [
  './src/img/ground_tiles/brickpavers2.png',
  './src/img/ground_tiles/concrete368a.png',
  './src/img/ground_tiles/cretebrick970.png',
  './src/img/ground_tiles/dirt.png',
  './src/img/ground_tiles/dirtsand2.png',
  './src/img/ground_tiles/rock.png',
  './src/img/ground_tiles/snow.png',
  './src/img/ground_tiles/stone.png'
];

export const mobileSpritePaths = ['./src/img/mobiles/8way_mobile.png'];

export const rand = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const coordsEqual = (a, b) => {
  return a.x == b.x && a.y == b.y;
};
