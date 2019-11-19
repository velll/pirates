import { Coordinates } from "../lib/coordinates";
import { Moveable } from "../game";
import { GameMap } from "../board/gamemap";
import { Wind } from "./wind";
import { Vector2d } from "../lib/vector-2d";

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

  // I'm not proud of this
  public getMovingRange(wind: Wind): Coordinates[] {
    const where  = this.coordinates;
    const windVector = new Vector2d(wind.direction);
    const aft    = {x: where.x - windVector.x, y: where.y - windVector.y};

    // Every ship can move to a cell next to it
    const around = GameMap.getCellsAround(where);
    let closeCells: Coordinates[];

    // Except only brigantines can go directly into the wind, galleons cannot.
    if (this.type == ShipType.brigantine) {
      closeCells = around;
    } else {
      closeCells = around.filter((cell) => {
        return !(cell.x == aft.x && cell.y == aft.y);
     });
    }

    // Ships can move up to three cells downwind
    const downwind = [
      {x: where.x + 2 * windVector.x,      y: where.y + 2 * windVector.y},
      {x: where.x + 3 * windVector.x,      y: where.y + 3 * windVector.y}
    ];

    // Only two cells on a tacking course (90 deg to the wind)
    const leftTack = windVector.rotate(-90);
    const rightTack = windVector.rotate(90);

    const tack = [
      {x: where.x + 2 * leftTack.x,      y: where.y + 2 * leftTack.y},
      {x: where.x + 2 * rightTack.x,     y: where.y + 2 * rightTack.y}
    ];

    // Three sells on a running course (45 deg each way from downwind)
    const leftRun = windVector.rotate(-45);
    const rightRun = windVector.rotate(45);

    const run = [
      {x: where.x + 2 * leftRun.x,       y: where.y + 2 * leftRun.y},
      {x: where.x + 3 * leftRun.x,       y: where.y + 3 * leftRun.y},
      {x: where.x + 2 * rightRun.x,      y: where.y + 2 * rightRun.y},
      {x: where.x + 3 * rightRun.x,      y: where.y + 3 * rightRun.y}
    ];

    return closeCells.concat(downwind, tack, run);
  }

  public getShootingRange(): Coordinates[] {
    if (this.type == ShipType.brigantine) {
      return  GameMap.getCellsAround(this.coordinates);
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
