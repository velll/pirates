import { Ship, ShipType } from "./game/ship";
import { Coordinates } from "./lib/coordinates";

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
  fleet: string;
  wreck: boolean;
  golden: boolean;
}

interface Order {
  type: ShipType;
  fleet: string;
  name: string;
  coords: Coordinates,
  gold?: boolean;
}

export { Shipyard, Design, Order};
