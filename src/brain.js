'use strict';

import {
  entityMapLocationFromCell,
  coordsEqual,
  arrayIncludesCoords
} from './util';
import { BinaryHeap } from './binary_heap';

export class MobileBrain {
  getActivity(entity, eventCell, blockingAnimationCallback) {
    let start = entity.cellLocation;
    let end = eventCell;
    let path = buildPathAStar(start, end);
    let destination = undefined;
    blockingAnimationCallback(true);
    return () => {
      if (destination != undefined) {
        let nextPosition = getNextMapPosition(entity, destination);
        entity.location = nextPosition;
        if (coordsEqual(entity.location, destination)) {
          destination = undefined;
        }
      } else if (path.length > 0) {
        entity.moveBetweenCells(entity.cellLocation, path[0]);
        destination = getDestination(entity, path);
      } else {
        entity.activityDone();
        blockingAnimationCallback(false);
      }
    };
  }
}

function getNextMapPosition(entity, destination) {
  let currentLoc = { x: entity.location.x, y: entity.location.y };
  let dx = currentLoc.x - destination.x,
    dy = currentLoc.y - destination.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let velX = (dx / dist) * 5;
  let velY = (dy / dist) * 5;
  if (Math.abs(dx) < Math.abs(velX)) {
    velX = dx;
  }
  if (Math.abs(dy) < Math.abs(velY)) {
    velY = dy;
  }
  return {
    x: (currentLoc.x -= velX),
    y: (currentLoc.y -= velY)
  };
}

function getDestination(entity, cellPath) {
  let nextCellDestination = cellPath.shift();
  let nextDestination = undefined;
  if (nextCellDestination != undefined) {
    nextDestination = entityMapLocationFromCell(
      nextCellDestination,
      entity.scene.map,
      entity.frameOffsets
    );
  }
  return nextDestination;
}

// Uses Brensenham's line algorithm
function buildPath(start, end) {
  let path = [];

  let currentX = start.x,
    currentY = start.y;
  let deltaX = Math.abs(end.x - start.x),
    deltaY = Math.abs(end.y - start.y);
  let slopeX = start.x < end.x ? 1 : -1,
    slopeY = start.y < end.y ? 1 : -1;
  let err = deltaX - deltaY;

  while (currentX != end.x || currentY != end.y) {
    let err2 = 2 * err;
    if (err2 > deltaY * -1) {
      err -= deltaY;
      currentX += slopeX;
    } else if (err2 < deltaX) {
      err += deltaX;
      currentY += slopeY;
    }
    path.push({ x: currentX, y: currentY });
  }
  return path;
}

function buildPathAStar(start, end) {
  let open = new BinaryHeap(
    a => {
      return a.f;
    },
    (a, b) => {
      return coordsEqual(a, b);
    }
  );
  open.push(new GraphNode(start));
  let closed = [];
  while (open.size() > 0) {
    let currentNode = open.pop();
    closed.push(currentNode);
    if (coordsEqual(currentNode, end)) {
      return buildPath(currentNode);
    }
    let neighbors = currentNode.neighbors;
    for (let neighbor of neighbors) {
      if (neighbor.pathable()) {
        let g = currentNode.g + 1;
        let f = g + manhattenDistance(neighbor, end);
        if (!arrayIncludesCoords(closed, neighbor)) {
          if (!open.includes(neighbor)) {
            neighbor.parent = currentNode;
            neighbor.f = f;
            open.push(neighbor);
          }
        } else if (neighbor.g >= g) {
          closed = closed.filter(el => !coordsEqual(el, neighbor));
          neighbor.parent = currentNode;
          neighbor.f = f;
          open.push(nieghbor);
        }
      } else if (!arrayIncludesCoords(closed, neighbor)) {
        closed.push(neighbor);
      }
    }
  }
  return []; // no path found
}

function buildPath(endNode) {
  let path = [];
  while (endNode.parent) {
    path.push(endNode.cell);
    endNode = endNode.parent;
  }
  return path.reverse();
}

function manhattenDistance(start, end) {
  return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

class GraphNode {
  constructor(cell) {
    this.cell = cell;
    this.f = 0;
  }
  get neighbors() {
    if (this.myNeighbors == undefined) {
      return this.cell.neighbors.map(neighbor => {
        return new GraphNode(neighbor);
      });
    }
    return this.myNeighbors;
  }
  set g(newG) {
    /* no op, g is computed from parent.g */
  }
  get g() {
    return this.parent != undefined ? this.parent.g + 1 : 0;
  }
  get coords() {
    return this.cell.coords;
  }
  get x() {
    return this.cell.coords.x;
  }
  get y() {
    return this.cell.coords.y;
  }
  pathable() {
    return this.cell.pathable();
  }
}
