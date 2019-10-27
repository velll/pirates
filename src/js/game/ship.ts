import { Coordinates } from "../lib/coordinates";
import { Moveable } from "../game";

class Ship implements Moveable {
  public type: ShipType;
  public fleet: string;
  public name: string;

  public coordinates: Coordinates;
  public status: ShipStatus;
  public carriesGold: boolean;

  public HP: number;

  private readonly HP_VALUES: Record<ShipType, number> = {
    galleon: 30,
    brigantine: 20
  };

  constructor(type: ShipType,
              fleet: string,
              name: string,
              initialCoordinates: Coordinates,
              carriesGold: boolean = false) {
    this.type = type;
    this.fleet = fleet;
    this.name = name;

    this.coordinates = initialCoordinates;
    this.carriesGold = carriesGold;
    this.status = ShipStatus.ready;

    this.HP = this.HP_VALUES[type];
  }

  public move(coordinates: Coordinates) {
    // FIXME: check if able to move

    this.coordinates = coordinates;
  }

  public damage(dmg: number) {
    this.HP -= dmg;

    if (this.HP <= 0) {
      this.status = ShipStatus.sunk;
    }
  }
}

enum ShipType {
  brigantine = "brigantine",
  galleon = "galleon"
}

enum ShipStatus {
  ready,
  sunk
}

export { Ship, ShipType };
