"use strict";

import "./styles/index.css";

import { Input } from "./input";
import { Game, LoadingSceneGamestate } from "./game";
import { sceneDef } from "./scene_definition";
import { throttle } from "./util";

document.addEventListener("DOMContentLoaded", function() {
  console.log("Proxima Reverie approaches!");

  let viewport = document.getElementById("viewport-canvas");
  let viewportDimensions = { x: 600, y: 400 };
  // @ts-ignore
  viewport.width = viewportDimensions.x;
  // @ts-ignore
  viewport.height = viewportDimensions.y;

  let game = new Game();
  game.changeState(new LoadingSceneGamestate(game, sceneDef, viewport));

  document.addEventListener("keydown", event => {
    Input.keyDown(event.key);
  });

  document.addEventListener("keyup", event => {
    Input.keyUp(event.key);
  });

  viewport.addEventListener("mouseup", event => {
    Input.mouseUp(event);
  });

  viewport.addEventListener(
    "mousemove",
    throttle(event => {
      Input.mouseMove(event);
    }, 20)
  );
});
