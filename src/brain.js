'use strict';

import {
  entityMapLocationFromCell,
  coordsEqual,
  arrayIncludesCoords
} from './util';
import { BinaryHeap } from './binary_heap';

export class MobileBrain {
  getActivity(entity, eventCell, blockingAnimationCallback) {
    let startCell = entity.currentCell;
    let endCell = eventCell;
    let cellPath = buildCellPathAStar(startCell, endCell);
    let destination = undefined;
    blockingAnimationCallback(true);
    return () => {
      if (destination != undefined) {
        let nextPosition = getNextMapPosition(entity, destination);
        entity.location = nextPosition;
        if (coordsEqual(entity.location, destination)) {
          destination = undefined;
        }
      } else if (cellPath.length > 0) {
        entity.currentCell = cellPath[0];
        destination = getDestination(entity, cellPath);
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
      entity.map,
      entity.frameOffsets
    );
  }
  return nextDestination;
}

// Uses Brensenham's line algorithm
function buildCellPath(start, end) {
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

function buildCellPathAStar(start, end) {
  // console.log('start buildCellPathAStar');
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
  // console.log(`end: ${end.constructor.name}`);
  // console.log(`  x${end.x}, y${end.y}`);
  while (open.size() > 0) {
    let currentNode = open.pop();
    closed.push(currentNode);
    // console.log('');
    // console.log('Considering....');
    // console.log(currentNode.constructor.name);
    // console.log(`  x${currentNode.x}, y${currentNode.y}, f${currentNode.f}`);
    if (coordsEqual(currentNode, end)) {
      // console.log(
      //   `currentNode x${currentNode.x}, y${currentNode.y} is end node x${
      //     end.x
      //   }, y${end.y}`
      // );
      return buildPath(currentNode);
    }
    // console.log(`closed:`);
    // for (let closedNode of closed) {
    // console.log(
    //   `  ${closedNode.constructor.name}: x${closedNode.x}, y${closedNode.y}`
    // );
    // }
    let neighbors = currentNode.neighbors;
    for (let neighbor of neighbors) {
      // console.log(
      //   `Considering neighbor ${neighbor.constructor.name} x${neighbor.x}, y${
      //     neighbor.y
      //   }`
      // );
      if (!arrayIncludesCoords(closed, neighbor)) {
        let g = currentNode.g + 1;
        // console.log(`  neighbor has g${neighbor.g}, f${neighbor.f}`);
        // console.log(
        //   `  closed does not include neighbor x${neighbor.x}, y${neighbor.y}`
        // );
        if (!open.includes(neighbor)) {
          open.push(neighbor);
        } else if (g >= neighbor.g) {
          continue;
        }
        neighbor.parent = currentNode;
        neighbor.f = neighbor.g + manhattenDistance(neighbor, end);
        console.log(neighbor.f);
      }
    }
  }
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
}
