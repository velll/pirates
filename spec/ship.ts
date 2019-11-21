import { Ship, ShipType } from '../src/js/game/ship';
import { Coordinates } from '../src/js/lib/coordinates';
import { pirates } from '../src/js/game/fleet';
import { Design } from '../src/js/shipyard';

let icons: Design[];
const ship = new Ship(ShipType.brigantine, pirates, "Tester's rage", {x: 10, y: 10}, icons);
const newCoordinates: Coordinates = {x: 8, y: 8};

test('ship should be able to move', () => {
  ship.move(newCoordinates);
  expect(ship.coordinates).toEqual(newCoordinates);
});

test('ship starts with full HP', () => {
  expect(ship.HP).toEqual(20);
});

test('ship can be damaged', () => {
  ship.damage(5);
  expect(ship.HP).toEqual(15);
});
