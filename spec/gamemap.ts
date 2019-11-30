import { MapConfig, Port } from '../src/js/board/gamemap';
import { Coordinates } from '../src/js/lib/coordinates';

import { GameMap } from '../src/js/board/gamemap';
import { neutrals } from '../src/js/game/fleet';


const rocks: Coordinates[] = [ {x: 1, y: 1} ]

let img: CanvasImageSource;

const ports: Port[] = [ 
    new Port({x: 5, y: 10}, "Plymouth", neutrals, {anchor: img, flag: img}),
    new Port({x: 20, y: 15}, "New York", neutrals, {anchor: img, flag: img}) 
]

const mapConfig: MapConfig = {
  rows: 10,
  columns: 10
};

const gameMap = new GameMap(mapConfig, rocks, ports);

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
  expect(gameMap.getFeatureByCoords({x: 8, y: 9})).not.toEqual('port');
});

test('map should be able to filter out invalid cells', () => {
  expect(gameMap.isOnMap({x: 5, y: 8})).toBe(true);
  expect(gameMap.isOnMap({x: 7, y: 3})).toBe(true);
  expect(gameMap.isOnMap({x: -1, y: 5})).toBe(false);
  expect(gameMap.isOnMap({x: 2, y: 27})).toBe(false);
});

// Statics

test('map should be able to check if the coordinates are the same', () => {
  expect(GameMap.isSameCell({x: 15, y: 25}, {x:15, y: 25})).toBe(true);
  expect(GameMap.isSameCell({x: 15, y: 25}, {x:14, y: 26})).toBe(false);
});


test('map should be able to find cells around a given cells', () => {
  const cell = {x: 10, y: 10}
  const around = [
    {x: 9, y: 9},   {x: 10, y: 9},  {x: 11, y: 9},
    {x: 9, y: 10},     /* no */     {x: 11, y: 10},
    {x: 9, y: 11},  {x: 10, y: 11}, {x: 11, y: 11}
  ];
  
  expect(GameMap.getCellsAround(cell)).toEqual(around);
});

test('map should be able to find 2 cells around a given cells', () => {
  const cell = {x: 5, y: 5}
  const around = [
    {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3}, {x: 7, y: 3},
    {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4}, {x: 7, y: 4},
    {x: 3, y: 5}, {x: 4, y: 5},   /* no */    {x: 6, y: 5}, {x: 7, y: 5},
    {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 7, y: 6},
    {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}, {x: 7, y: 7}
  ];

  expect(GameMap.getCellsAround(cell, 2)).toEqual(around);

})