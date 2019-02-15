"use strict";

export const sceneDef = {
  mapDef: {
    mapSize: 10,
    tileDefs: [
      {
        imagePath: "./src/img/ground_tiles/brickpavers2.png",
        frameSize: { x: 512, y: 256 }
      },
      {
        imagePath: "./src/img/ground_tiles/concrete368a.png",
        frameSize: { x: 256, y: 128 }
      },
      {
        imagePath: "./src/img/ground_tiles/cretebrick970.png",
        frameSize: { x: 512, y: 256 }
      },
      {
        imagePath: "./src/img/ground_tiles/dirt.png",
        frameSize: { x: 256, y: 128 }
      },
      {
        imagePath: "./src/img/ground_tiles/dirtsand2.png",
        frameSize: { x: 512, y: 256 }
      },
      {
        imagePath: "./src/img/ground_tiles/rock.png",
        frameSize: { x: 256, y: 128 }
      },
      {
        imagePath: "./src/img/ground_tiles/snow.png",
        frameSize: { x: 256, y: 128 }
      },
      {
        imagePath: "./src/img/ground_tiles/stone.png",
        frameSize: { x: 512, y: 256 }
      }
    ]
  },
  mobileDefs: [
    {
      imagePath: "./src/img/mobiles/8way_mobile.png",
      startCell: { x: 3, y: 3 },
      frameSize: { width: 60, height: 110 },
      frameOffsets: { x: 30, y: 100 },
      brainName: "MobileBrain"
    },
    {
      imagePath: "./src/img/mobiles/8way_mobile.png",
      startCell: { x: 5, y: 4 },
      frameSize: { width: 60, height: 110 },
      frameOffsets: { x: 30, y: 100 },
      brainName: "MobileBrain"
    },
    {
      imagePath: "./src/img/mobiles/8way_mobile.png",
      startCell: { x: 3, y: 6 },
      frameSize: { width: 60, height: 110 },
      frameOffsets: { x: 30, y: 100 },
      brainName: "MobileBrain"
    },
    {
      imagePath: "./src/img/mobiles/8way_mobile.png",
      startCell: { x: 8, y: 2 },
      frameSize: { width: 60, height: 110 },
      frameOffsets: { x: 30, y: 100 },
      brainName: "AIBrain"
    },
    {
      imagePath: "./src/img/mobiles/8way_mobile.png",
      startCell: { x: 2, y: 1 },
      frameSize: { width: 60, height: 110 },
      frameOffsets: { x: 30, y: 100 },
      brainName: "AIBrain"
    }
  ],
  propDefs: [
    {
      imagePath: "./src/img/props/statue1-01.png",
      startCell: { x: 5, y: 5 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    },
    {
      imagePath: "./src/img/props/statue1-02.png",
      startCell: { x: 0, y: 3 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    },
    {
      imagePath: "./src/img/props/statue1-03.png",
      startCell: { x: 4, y: 1 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    },
    {
      imagePath: "./src/img/props/statue1-04.png",
      startCell: { x: 5, y: 1 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    },
    {
      imagePath: "./src/img/props/statue1-02.png",
      startCell: { x: 6, y: 0 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    },
    {
      imagePath: "./src/img/props/statue1-03.png",
      startCell: { x: 7, y: 9 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 64, y: 112 }
    }
  ]
};
