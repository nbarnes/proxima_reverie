'use strict';

export const rand = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const coordsEqual = (a, b) => {
  return a.x == b.x && a.y == b.y;
};
