import { Features, MapConfig } from '../src/js/board/gamemap';
import { Coordinates } from '../src/js/lib/coordinates';

import { GameMap } from '../src/js/board/gamemap';

const features: Features = {
  rocks: [ {x: 1, y: 1} ],
  ports: [ 
    {x: 5, y: 10,  name: "Plymouth", fleet: "British"},
    {x: 20, y: 15, name: "New York", fleet: "American"} 
  ]
};

const mapConfig: MapConfig = {
  rows: 10,
  columns: 10
};

const gameMap = new GameMap(mapConfig, features);

test('map should know where rocks are', () => {
  expect(gameMap.getFeatureByCoords({x: 1, y: 1})).toEqual('rock');
});

test('map should not think there are rocks when theres none', () => {
  expect(gameMap.getFeatureByCoords({x: 1, y: 2})).not.toEqual('rock');
});

test('map should know where ports are', () => {
  expect(gameMap.getFeatureByCoords({x: 5, y: 10})).toEqual('port');
});

test('map should not think there are ports when theres none', () => {
  expect(gameMap.getFeatureByCoords({x: 15, y: 25})).not.toEqual('port');
});
