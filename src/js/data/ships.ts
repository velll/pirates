import { Order } from '../shipyard';
import { ShipType } from '../game/ship';
import { spaniards, pirates } from '../game/fleet';

const orders: Order[] = [
  {type: ShipType.galleon, fleet: spaniards, name: "Santa Clara", coords: {x: 1, y: 16}, gold: true},
  {type: ShipType.galleon, fleet: spaniards, name: "Domingo",     coords: {x: 7, y: 20}},
  {type: ShipType.galleon, fleet: spaniards, name: "Idalho",      coords: {x: 5, y: 14}},
  {type: ShipType.brigantine, fleet: pirates, name: "Black Hawk",       coords:  {x: 8, y: 7}},
  {type: ShipType.brigantine, fleet: pirates, name: "Fortune's galley",  coords: {x: 13, y: 9}},
  {type: ShipType.brigantine, fleet: pirates, name:  "Gentelman Jack",   coords:  {x: 30, y: 17}},
  {type: ShipType.brigantine, fleet: pirates, name: "HMS Indefatigable", coords: {x: 40, y: 0}},
  {type: ShipType.brigantine, fleet: pirates, name: "Ominous",           coords: {x: 16, y: 21}},
  {type: ShipType.brigantine, fleet: pirates, name: "Bullshit squad",    coords: {x: 14, y: 17}}
];

export { orders };
