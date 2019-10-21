import { Coordinates } from "../board/gamemap";
import { Moveable } from "../game";

class Ship implements Moveable {
  public type: string;
  public fleet: string;
  public name: string;

  public coordinates: Coordinates;
  public status: string;

  constructor(type: string,
               fleet: string,
               name: string,
               initialCoordinates: Coordinates) {
    this.type = type;
    this.fleet = fleet;
    this.name = name;

    this.coordinates = initialCoordinates;
    this.status = "created";
  }

  public move(coordinates: Coordinates) {
    // FIXME: check if able to move

    this.coordinates = coordinates;
  }
}

export { Ship };
