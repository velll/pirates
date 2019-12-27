import { WindView } from "../views/wind";
import { Vector2d } from "../lib/vector-2d";
import { Coordinates } from "../lib/coordinates";

interface Direction {
  name: string;
  x: number;
  y: number;
}

enum ForceScale {
  calm,
  breeze,
  storm
}

class Wind {

  public static readonly DIRECTIONS: Record<string, Direction> = {
    N:  {name: "N",  x: 0,  y: 1},
    NE: {name: "NE", x: -1, y: 1},
    E:  {name: "E",  x: -1, y: 0},
    SE: {name: "SE", x: -1, y: -1},
    S:  {name: "S",  x: 0,  y: -1},
    SW: {name: "SW", x: 1,  y: -1},
    W:  {name: "W",  x: 1,  y: 0},
    NW: {name: "NW", x: 1,  y: 1}
  };

  public static readonly BEARINGS = ["N", "NE", "E", "SE", "S", "SW", "W", "NE"];
  public direction: Direction;
  public force: ForceScale;

  public view: WindView;

  constructor(direction: Direction, force: ForceScale) {
    this.direction = direction;
    this.force = force;

    this.view = new WindView(this);
  }

  public getName() {
    return this.direction.name;
  }

  public getForce() {
    return ForceScale[this.force]; // Using reverse mapping of the enums here
  }

  public description() {
    return this.force == ForceScale.calm ? this.getForce() : `${this.direction.name} (${this.getForce()})`;
  }

  public isCalm() {
    return this.force == ForceScale.calm;
  }

  public isStorm() {
    return this.force == ForceScale.storm;
  }

  public toVector(): Vector2d {
    return new Vector2d({x: this.direction.x, y: this.direction.y});
  }

  public follow(from: Coordinates) {
    return this.toVector().apply(from);
  }
}

export { Wind, ForceScale };
