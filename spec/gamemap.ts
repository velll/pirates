import { Features } from '../src/js/board/gamemap'
import { Cell } from '../src/js/board/cell'

import { GameMap } from '../src/js/board/gamemap'

const features: Features = {
  rocks: [ new Cell(1, 1) ],
  ports: [ new Cell(5, 10), new Cell(20, 15) ]
}

const gameMap = new GameMap(features);

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
