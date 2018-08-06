'use strict';

export const sceneDef = {
  mapDef: {
    mapSize: 10,
    tileImagePaths: [
      './src/img/ground_tiles/brickpavers2.png',
      './src/img/ground_tiles/concrete368a.png',
      './src/img/ground_tiles/cretebrick970.png',
      './src/img/ground_tiles/dirt.png',
      './src/img/ground_tiles/dirtsand2.png',
      './src/img/ground_tiles/rock.png',
      './src/img/ground_tiles/snow.png',
      './src/img/ground_tiles/stone.png'
    ]
  },
  mobileDefs: [
    {
      imagePaths: ['./src/img/mobiles/8way_mobile.png'],
      startTile: { x: 3, y: 3 },
      frameSize: { width: 60, height: 110 },
      frameOffsets: { x: 30, y: 110 }
    },
    {
      imagePaths: ['./src/img/mobiles/8way_mobile.png'],
      startTile: { x: 5, y: 4 },
      frameSize: { width: 60, height: 110 },
      frameOffsets: { x: 30, y: 110 }
    },
    {
      imagePaths: ['./src/img/mobiles/8way_mobile.png'],
      startTile: { x: 3, y: 6 },
      frameSize: { width: 60, height: 110 },
      frameOffsets: { x: 30, y: 110 }
    }
  ],
  propDefs: [
    {
      imagePaths: ['./src/img/props/statue1-01.png'],
      startTile: { x: 5, y: 5 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 0, y: 14 }
    },
    {
      imagePaths: ['./src/img/props/statue1-02.png'],
      startTile: { x: 0, y: 3 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 0, y: 14 }
    },
    {
      imagePaths: ['./src/img/props/statue1-03.png'],
      startTile: { x: 4, y: 1 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 0, y: 14 }
    },
    {
      imagePaths: ['./src/img/props/statue1-04.png'],
      startTile: { x: 5, y: 1 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 0, y: 14 }
    },
    {
      imagePaths: ['./src/img/props/statue1-02.png'],
      startTile: { x: 6, y: 0 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 0, y: 14 }
    },
    {
      imagePaths: ['./src/img/props/statue1-03.png'],
      startTile: { x: 7, y: 9 },
      frameSize: { width: 128, height: 128 },
      frameOffsets: { x: 0, y: 14 }
    }
  ]
};
