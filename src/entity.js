
"use strict";

import { Assets } from "./asset_manager";
import Loadable from "./asset_owner";

export default class Entity extends Loadable {

  constructor(assetPaths) {
    super(assetPaths);
  }

  loadComplete() {}

  get image() {
    return Assets.get(this.assetPaths[0]);
  }

}
