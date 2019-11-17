import { Ship, ShipType } from '../src/js/game/ship';
import { Turn } from '../src/js/game/turn';
import { Coordinates } from '../src/js/lib/coordinates';
import { WindGenerator } from '../src/js/game/wind-generator';


const startingCoordinates: Coordinates = {x: 10, y: 10};
const wind = new WindGenerator().getBreeze("N");
const ship = new Ship(ShipType.brigantine, "pirates", "Tester's rage", startingCoordinates);
const turn = new Turn(0, ship, wind);

const validCoordinates: Coordinates = {x: 11, y: 10};
const invalidCoordinates: Coordinates = {x: 27, y: 4};

test('each turn we must know where we can move', () => {
  expect(turn.isValidMove(validCoordinates)).toBe(true);
});

test('each turn we must know where we cannot move', () => {
  expect(turn.isValidMove(invalidCoordinates)).toBe(false);
});
