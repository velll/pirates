import { Order } from '../shipyard';
import { ShipType } from '../game/ship';
import { spaniards, pirates } from '../game/fleet';
import { t } from './i18n';

const orders: Order[] = [
  {type: ShipType.galleon, fleet: spaniards, name: t("ships.spanish1"), coords: {x: 1,  y: 16}},
  {type: ShipType.galleon, fleet: spaniards, name: t("ships.spanish2"), coords: {x: 7,  y: 20}},
  {type: ShipType.galleon, fleet: spaniards, name: t("ships.spanish3"), coords: {x: 5,  y: 14}},
  {type: ShipType.brigantine, fleet: pirates, name: t("ships.pirate1"), coords: {x: 8,  y: 7}},
  {type: ShipType.brigantine, fleet: pirates, name: t("ships.pirate2"), coords: {x: 10, y: 15}},
  {type: ShipType.brigantine, fleet: pirates, name: t("ships.pirate3"), coords: {x: 30, y: 17}},
  {type: ShipType.brigantine, fleet: pirates, name: t("ships.pirate4"), coords: {x: 40, y: 0}},
  {type: ShipType.brigantine, fleet: pirates, name: t("ships.pirate5"), coords: {x: 16, y: 21}},
  {type: ShipType.brigantine, fleet: pirates, name: t("ships.pirate6"), coords: {x: 14, y: 17}}
];

export { orders };
