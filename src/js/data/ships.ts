import { Order } from '../shipyard';
import { ShipType } from '../game/ship';

const orders: Order[] = [
  {type: ShipType.galleon, fleet: "Spaniards", name: "Santa Clara", coords: {x: 4, y: 22}, gold: true},
  {type: ShipType.galleon, fleet: "Spaniards", name: "Domingo",     coords: {x: 4, y: 21}},
  {type: ShipType.galleon, fleet: "Spaniards", name: "Idalho",      coords: {x: 2, y: 16}},
  {type: ShipType.brigantine, fleet: "Pirates", name: "Black Hawk",       coords:  {x: 6, y: 17}},
  {type: ShipType.brigantine, fleet: "Pirates", name: "Fortune's galley",  coords: {x: 10, y: 12}},
  {type: ShipType.brigantine, fleet: "Pirates", name:  "Gentelman Jack",   coords:  {x: 28, y: 19}},
  {type: ShipType.brigantine, fleet: "Pirates", name: "HMS Indefatigable", coords: {x: 37, y: 1}},
  {type: ShipType.brigantine, fleet: "Pirates", name: "Ominous",           coords: {x: 31, y: 20}},
  {type: ShipType.brigantine, fleet: "Pirates", name: "Bullshit squad",    coords: {x: 13, y: 23}}
];

export { orders };
