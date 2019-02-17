"use strict";

export const sceneDef = {
  assetDefs: [
    {
      shorthand: "brickTile",
      imagePath: "./src/img/ground_tiles/brickpavers2.png",
      frameSize: { x: 512, y: 256 }
    },
    {
      shorthand: "concreteTile",
      imagePath: "./src/img/ground_tiles/concrete368a.png",
      frameSize: { x: 256, y: 128 }
    },
    {
      shorthand: "concreteBrickTile",
      imagePath: "./src/img/ground_tiles/cretebrick970.png",
      frameSize: { x: 512, y: 256 }
    },
    {
      shorthand: "dirtTile",
      imagePath: "./src/img/ground_tiles/dirt.png",
      frameSize: { x: 256, y: 128 }
    },
    {
      shorthand: "dirtSandTile",
      imagePath: "./src/img/ground_tiles/dirtsand2.png",
      frameSize: { x: 512, y: 256 }
    },
    {
      shorthand: "rockTile",
      imagePath: "./src/img/ground_tiles/rock.png",
      frameSize: { x: 256, y: 128 }
    },
    {
      shorthand: "snowTile",
      imagePath: "./src/img/ground_tiles/snow.png",
      frameSize: { x: 256, y: 128 }
    },
    {
      shorthand: "stoneTile",
      imagePath: "./src/img/ground_tiles/stone.png",
      frameSize: { x: 512, y: 256 }
    },
    {
      shorthand: "8WayMobile",
      imagePath: "./src/img/mobiles/8way_mobile.png",
      frameSize: { width: 60, height: 110 },
      frameOffsets: { x: 30, y: 100 }
    },
    {
      shorthand: "statue1",
      imagePath: "./src/img/props/statue1-01.png",
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    },
    {
      shorthand: "statue2",
      imagePath: "./src/img/props/statue1-02.png",
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    },
    {
      shorthand: "statue3",
      imagePath: "./src/img/props/statue1-03.png",
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    },
    {
      shorthand: "statue4",
      imagePath: "./src/img/props/statue1-04.png",
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    }
  ],

  mapDef: {
    mapSize: 10,

    tileDefs: [
      "brickTile",
      "concreteTile",
      "concreteBrickTile",
      "stoneTile",
      "snowTile",
      "rockTile",
      "dirtSandTile",
      "dirtTile"
    ]
  },
  mobileDefs: [
    {
      assetShorthand: "8WayMobile",
      startCell: { x: 3, y: 3 },
      brainName: "MobileBrain"
    },
    {
      assetShorthand: "8WayMobile",
      startCell: { x: 5, y: 4 },
      brainName: "MobileBrain"
    },
    {
      assetShorthand: "8WayMobile",
      startCell: { x: 3, y: 6 },
      brainName: "MobileBrain"
    }
    // {
    //   assetShorthand: "8WayMobile",
    //   startCell: { x: 8, y: 2 },
    //   frameSize: { width: 60, height: 110 },
    //   frameOffsets: { x: 30, y: 100 },
    //   brainName: "AIBrain"
    // },
    // {
    //   assetShorthand: "8WayMobile",
    //   startCell: { x: 2, y: 1 },
    //   frameSize: { width: 60, height: 110 },
    //   frameOffsets: { x: 30, y: 100 },
    //   brainName: "AIBrain"
    // }
  ],
  propDefs: [
    {
      assetShorthand: "statue1",
      startCell: { x: 5, y: 5 }
    },
    {
      assetShorthand: "statue1",
      startCell: { x: 0, y: 3 }
    },
    {
      assetShorthand: "statue1",
      startCell: { x: 4, y: 1 }
    },
    {
      assetShorthand: "statue1",
      startCell: { x: 5, y: 1 }
    },
    {
      assetShorthand: "statue2",
      startCell: { x: 6, y: 0 }
    },
    {
      assetShorthand: "statue3",
      startCell: { x: 7, y: 9 }
    }
  ]
};
