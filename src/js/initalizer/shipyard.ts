import { Ship, ShipType } from "../game/ship";
import { Coordinates } from "../lib/coordinates";
import { spaniards, pirates, Fleet } from "../game/fleet";
import { Resources } from './resources';

class Shipyard {

  public static build(resources: Resources): Shipyard {
    return new Shipyard([
      {icon: resources.ships.galleon,            type: "galleon",    fleet: spaniards, wreck: false, golden: false},
      {icon: resources.ships.sailboat,           type: "brigantine", fleet: pirates,   wreck: false, golden: false},
      {icon: resources.ships.galleonWreck,       type: "galleon",    fleet: spaniards, wreck: true,  golden: false},
      {icon: resources.ships.sailboatWreck,      type: "brigantine", fleet: pirates,   wreck: true,  golden: false},
      {icon: resources.ships.goldSpanishGalleon, type: "galleon",    fleet: spaniards, wreck: false, golden: true},
      {icon: resources.ships.goldPirateGalleon,  type: "galleon",    fleet: pirates,   wreck: false, golden: true},
      {icon: resources.ships.goldSpanishGalleonWrecked,
                                                 type: "galleon",    fleet: spaniards, wreck: true,  golden: true},
      {icon: resources.ships.goldPirateGalleonWrecked,
                                                 type: "galleon",    fleet: pirates,   wreck: true,  golden: true}
    ]);
  }
  private designs: Design[];

  constructor(designs: Design[]) {
    this.designs = designs;
  }

  public buildAll(orders: Order[]) {
    return orders.map(order => (this.build(order)));
  }
  public build(order: Order) {
    return new Ship(order.type, order.fleet, order.name,
      order.coords, this.getIconsFor(order.type));
  }

  public getIconsFor(type: ShipType): Design[] {
    return this.designs.filter(design => (design.type == type));
  }
}

interface Design {
  icon: CanvasImageSource;
  type: string;
  fleet: Fleet;
  wreck: boolean;
  golden: boolean;
}

interface Order {
  type: ShipType;
  fleet: Fleet;
  name: string;
  coords: Coordinates,
}

export { Shipyard, Design, Order};
