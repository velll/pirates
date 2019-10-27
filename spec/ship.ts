import { Ship } from '../src/js/game/ship';
import { Coordinates } from '../src/js/lib/coordinates';

const ship = new Ship("brigantine", "pirates", "Tester's rage", {x: 10, y: 10});
const newCoordinates: Coordinates = {x: 8, y: 8};

test('ship should be able to move', () => {
  ship.move(newCoordinates);
  expect(ship.coordinates).toEqual(newCoordinates);
});
