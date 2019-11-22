import { Coordinates } from "../lib/coordinates";
import { Fleet } from "../game/fleet";
import { PortView } from "../views/port";

class Port {
  public coordinates: Coordinates;
  public name: string;
  public fleet: Fleet;
  public view: PortView;

  constructor(coordinates: Coordinates, name: string, fleet: Fleet,
              icons: {anchor: CanvasImageSource, flag: CanvasImageSource}) {
    this.coordinates = coordinates;
    this.name = name;
    this.fleet = fleet;

    this.view = new PortView(this, icons.anchor, icons.flag);
  }
}

export { Port };
