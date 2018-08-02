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
  entityDefs: [
    {
      imagePaths: ['./src/img/mobiles/8way_mobile.png'],
      startTile: { x: 3, y: 3 }
    },
    {
      imagePaths: ['./src/img/mobiles/8way_mobile.png'],
      startTile: { x: 5, y: 4 }
    },
    {
      imagePaths: ['./src/img/mobiles/8way_mobile.png'],
      startTile: { x: 3, y: 6 }
    }
  ]
};
