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
  public maxHP: number;

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

    this.maxHP = this.HP_VALUES[type];
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

  public getShootingRange(): Coordinates[] {
    if (this.type == ShipType.brigantine) {
      return  [
        {x: this.coordinates.x - 1, y: this.coordinates.y - 1},
        {x: this.coordinates.x - 1, y: this.coordinates.y},
        {x: this.coordinates.x - 1, y: this.coordinates.y + 1},
        {x: this.coordinates.x,     y: this.coordinates.y - 1},
        // this.coordinates is not available
        {x: this.coordinates.x,     y: this.coordinates.y + 1},
        {x: this.coordinates.x + 1, y: this.coordinates.y - 1},
        {x: this.coordinates.x + 1, y: this.coordinates.y},
        {x: this.coordinates.x + 1, y: this.coordinates.y + 1}
      ];
    } else if (this.type == ShipType.galleon) {
      return [
        {x: this.coordinates.x - 2, y: this.coordinates.y - 2},
        {x: this.coordinates.x - 2, y: this.coordinates.y - 1},
        {x: this.coordinates.x - 2, y: this.coordinates.y},
        {x: this.coordinates.x - 2, y: this.coordinates.y + 1},
        {x: this.coordinates.x - 2, y: this.coordinates.y + 2},

        {x: this.coordinates.x - 1, y: this.coordinates.y - 2},
        {x: this.coordinates.x - 1, y: this.coordinates.y - 1},
        {x: this.coordinates.x - 1, y: this.coordinates.y},
        {x: this.coordinates.x - 1, y: this.coordinates.y + 1},
        {x: this.coordinates.x - 1, y: this.coordinates.y + 2},

        {x: this.coordinates.x, y: this.coordinates.y - 2},
        {x: this.coordinates.x, y: this.coordinates.y - 1},
        // this.coordinates is not available
        {x: this.coordinates.x, y: this.coordinates.y + 1},
        {x: this.coordinates.x, y: this.coordinates.y + 2},

        {x: this.coordinates.x + 1, y: this.coordinates.y - 2},
        {x: this.coordinates.x + 1, y: this.coordinates.y - 1},
        {x: this.coordinates.x + 1, y: this.coordinates.y},
        {x: this.coordinates.x + 1, y: this.coordinates.y + 1},
        {x: this.coordinates.x + 1, y: this.coordinates.y + 2},

        {x: this.coordinates.x + 2, y: this.coordinates.y - 2},
        {x: this.coordinates.x + 2, y: this.coordinates.y - 1},
        {x: this.coordinates.x + 2, y: this.coordinates.y},
        {x: this.coordinates.x + 2, y: this.coordinates.y + 1},
        {x: this.coordinates.x + 2, y: this.coordinates.y + 2}
      ];
    } else {
      throw Error("Unknown ship type " + this.type);
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
