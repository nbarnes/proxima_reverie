"use strict";

import {
  entityMapLocationFromCell,
  coordsEqual,
  arrayIncludesCoords
} from "./util";
import { BinaryHeap } from "./binary_heap";

export const BrainFactory = (function() {
  function newBrain(brainName, entity) {
    if (brainName == "MobileBrain") {
      return new MobileBrain(entity);
    } else if (brainName == "AIBrain") {
      return new AIBrain(entity);
    }
  }
  return {
    newBrain: newBrain
  };
})();

class Brain {
  constructor(newEntity) {
    this.entity = newEntity;
  }
}

class MobileBrain extends Brain {
  constructor(entity) {
    super(entity);
  }
  getActivity(eventCell, startCallback, endCallback) {
    let start = this.entity.cellLocation;
    let end = eventCell;
    let path = buildPathAStar(start, end);
    let destination = undefined;
    startCallback();
    return () => {
      if (destination != undefined) {
        let nextPosition = getNextMapPosition(this.entity, destination);
        this.entity.location = nextPosition;
        if (coordsEqual(this.entity.location, destination)) {
          destination = undefined;
        }
      } else if (path.length > 0) {
        this.entity.moveBetweenCells(this.entity.cellLocation, path[0]);
        destination = getDestination(this.entity, path);
      } else {
        this.entity.activityDone();
        endCallback();
      }
    };
  }
}

class AIBrain extends Brain {
  constructor(entity) {
    super(entity);
  }

  getActivity(eventCell, startCallback, endCallback) {
    let start = this.entity.cellLocation;
    let path = buildPathAStar(start, eventCell.coords);
    let destination = undefined;
    startCallback();
    return () => {
      if (destination != undefined) {
        let nextPosition = getNextMapPosition(this.entity, destination);
        this.entity.location = nextPosition;
        if (coordsEqual(this.entity.location, destination)) {
          destination = undefined;
        }
      } else if (path.length > 0) {
        this.entity.moveBetweenCells(this.entity.cellLocation, path[0]);
        destination = getDestination(this.entity, path);
      } else {
        this.entity.activityDone();
        endCallback();
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
      entity.asset.frameOffsets
    );
  }
  return nextDestination;
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
          open.push(neighbor);
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
    this.myNeighbors = undefined;
    this.parent = undefined;
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
