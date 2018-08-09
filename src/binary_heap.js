// Code for binary heap adapted from
// http://eloquentjavascript.net/1st_edition/appendix2.html
// by Marijn Haverbeke

'use strict';

export class BinaryHeap {
  constructor(scoreFunction, equalityFunction) {
    this.scoreFunction = scoreFunction;
    this.equalityFunction = equalityFunction;
    this.elements = [];
  }

  first() {
    return this.elements[0];
  }

  push(newElement) {
    // Add the new element to the end of the array.
    this.elements.push(newElement);
    // Allow it to bubble up.
    this.bubbleUp(this.elements.length - 1);
  }

  pop() {
    // Store the first element so we can return it later.
    let first = this.elements[0];
    // Get the element at the end of the array.
    let last = this.elements.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.elements.length > 0) {
      this.elements[0] = last;
      this.sinkDown(0);
    }
    return first;
  }

  remove(targetElement) {
    for (let [i, element] of this.elements.entries()) {
      if (this.equalityFunction(targetElement, element)) {
        let lastElement = this.elements.pop();
        if (!(i == length - 1)) {
          this.elements[i] = lastElement;
          this.bubbleUp(i);
          this.sinkDown(i);
        }
      }
    }
  }

  size() {
    return this.elements.length;
  }

  includes(targetElement) {
    return this.elements.indexOf(targetElement) != -1;
  }

  bubbleUp(i) {
    // Fetch the element that has to be moved.
    let element = this.elements[i],
      score = this.scoreFunction(element);
    // When at 0, an element cannot go up any further.
    while (i > 0) {
      // Compute the parent element's index, and fetch it.
      let parentI = Math.floor((i + 1) / 2) - 1,
        parent = this.elements[parentI];
      // If the parent has a lesser score, things are in order and we
      // are done.
      if (score >= this.scoreFunction(parent)) break;
      // Otherwise, swap the parent with the current element and
      // continue.
      this.elements[parentI] = element;
      this.elements[i] = parent;
      i = parentI;
    }
  }

  sinkDown(i) {
    // Look up the target element and its score.
    var length = this.elements.length,
      element = this.elements[i],
      score = this.scoreFunction(element);

    while (true) {
      // Compute the indices of the child elements.
      var child2i = (i + 1) * 2,
        child1i = child2i - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1i < length) {
        // Look it up and compute its score.
        var child1 = this.elements[child1i],
          child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < score) swap = child1i;
      }
      // Do the same checks for the other child.
      if (child2i < length) {
        var child2 = this.elements[child2i],
          child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? score : child1Score)) swap = child2i;
      }

      // No need to swap further, we are done.
      if (swap == null) break;

      // Otherwise, swap and continue.
      this.elements[i] = this.elements[swap];
      this.elements[swap] = element;
      i = swap;
    }
  }
}
