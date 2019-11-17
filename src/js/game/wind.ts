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
    N:  {name: "N",  x: 0,  y: -1},
    NE: {name: "NE", x: 1,  y: -1},
    E:  {name: "E",  x: 1,  y: 0},
    SE: {name: "SE", x: 1,  y: 1},
    S:  {name: "S",  x: 0,  y: 1},
    SW: {name: "SW", x: -1, y: 1},
    W:  {name: "W",  x: -1, y: 0},
    WE: {name: "WE", x: -1, y: -1}
  };

  public static readonly BEARINGS = ["N", "NE", "E", "SE", "S", "SW", "W", "WE"];
  public direction: Direction;
  public force: ForceScale;

  constructor(direction: Direction, force: ForceScale) {
    this.direction = direction;
    this.force = force;
  }

  public getName() {
    return this.direction.name;
  }

  public getForce() {
    return ForceScale[this.force]; // Using reverse mapping of the enums here
  }

}

export { Wind, ForceScale };
