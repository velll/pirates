import { Coordinates } from '../src/js/lib/coordinates';
import { ship } from './examples/elegant-ships'

const newCoordinates: Coordinates = {x: 8, y: 8};

test('ship should be able to move', () => {
  ship.move(newCoordinates);
  expect(ship.coordinates).toEqual(newCoordinates);
});

test('ship starts with full HP', () => {
  expect(ship.HP).toEqual(20);
});

test('ship can be damaged', () => {
  ship.damage();
  expect(ship.HP).toEqual(10);
});
