import { Turn, OffLimits } from '../../src/js/game/turn';
import { Coordinates } from '../../src/js/lib/coordinates';
import { WindGenerator } from '../../src/js/game/wind-generator';

import { ship } from './elegant-ships'

const offLimit: OffLimits = {move: [], shot: []};

const wind = new WindGenerator().getBreeze("N");
const movement = ship.getMovingRange(wind);
const turn = new Turn(0, new Date(), ship, wind, movement, offLimit);

const validCoordinates: Coordinates = {x: 11, y: 10};
const invalidCoordinates: Coordinates = {x: 27, y: 4};

export { turn, validCoordinates, invalidCoordinates}