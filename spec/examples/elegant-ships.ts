import { Ship, ShipType } from '../../src/js/game/ship';
import { pirates, spaniards } from '../../src/js/game/fleet';
import { Design } from '../../src/js/shipyard';

let icons: Design[];
const ship = new Ship(ShipType.brigantine, pirates, "Tester's rage", {x: 10, y: 10}, icons);

const spanishShips = [
  new Ship(ShipType.galleon, spaniards, "Tester's honor", {x: 18, y: 13}, icons),
  new Ship(ShipType.galleon, spaniards, "Tester's mind", {x: 20, y: 1},  icons),
  new Ship(ShipType.galleon, spaniards, "Tester's psyche", {x: 4,  y: 25}, icons),
];

export { ship, spanishShips }