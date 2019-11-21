import { Order } from '../shipyard';
import { ShipType } from '../game/ship';
import { spaniards, pirates } from '../game/fleet';

const orders: Order[] = [
  {type: ShipType.galleon, fleet: spaniards, name: "Santa Clara", coords: {x: 4, y: 22}, gold: true},
  {type: ShipType.galleon, fleet: spaniards, name: "Domingo",     coords: {x: 4, y: 21}},
  {type: ShipType.galleon, fleet: spaniards, name: "Idalho",      coords: {x: 2, y: 16}},
  {type: ShipType.brigantine, fleet: pirates, name: "Black Hawk",       coords:  {x: 6, y: 17}},
  {type: ShipType.brigantine, fleet: pirates, name: "Fortune's galley",  coords: {x: 10, y: 12}},
  {type: ShipType.brigantine, fleet: pirates, name:  "Gentelman Jack",   coords:  {x: 28, y: 19}},
  {type: ShipType.brigantine, fleet: pirates, name: "HMS Indefatigable", coords: {x: 37, y: 1}},
  {type: ShipType.brigantine, fleet: pirates, name: "Ominous",           coords: {x: 31, y: 20}},
  {type: ShipType.brigantine, fleet: pirates, name: "Bullshit squad",    coords: {x: 13, y: 23}}
];

export { orders };
