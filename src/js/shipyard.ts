import { Ship, ShipType } from "./game/ship";
import { Coordinates } from "./lib/coordinates";
import { Fleet } from "./game/fleet";

class Shipyard {
  private designs: Design[];

  constructor(designs: Design[]) {
    this.designs = designs;
  }

  public buildAll(orders: Order[]) {
    return orders.map(order => (this.build(order)));
  }
  public build(order: Order) {
    return new Ship(order.type, order.fleet, order.name,
      order.coords, this.getIconsFor(order.type), order.gold);
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
  gold?: boolean;
}

export { Shipyard, Design, Order};
