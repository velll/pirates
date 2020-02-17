import { WindView } from "../views/wind";
import { Vector2d } from "../lib/vector-2d";
import { Coordinates } from "../lib/coordinates";
import { assert } from "../lib/assert";
import { t } from "../data/i18n";

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

  public static readonly BEARINGS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  public static readonly SCALE = [
    ForceScale.calm,             // 1 out of 6 is calm
    ForceScale.breeze,           // 4 out of 6 is a simple breeze
    ForceScale.breeze,           //
    ForceScale.breeze,           //
    ForceScale.breeze,           //
    ForceScale.storm             // 1 out of 6 is storm
  ];

  public direction: Direction;
  public forceValue: number;
  public force: ForceScale;

  public view: WindView;

  constructor(bearing: string, forceValue: number) {
    assert(Wind.BEARINGS.includes(bearing), `Unknown bearing ${bearing}`);
    this.direction = Wind.DIRECTIONS[bearing];

    this.forceValue = forceValue;
    this.force = Wind.SCALE[forceValue];

    this.view = new WindView(this);
  }

  public get bearing() {
    return this.direction.name;
  }

  public getForce() {
    return ForceScale[this.force]; // Using reverse mapping of the enums here
  }

  public description() {
    return this.isCalm() ? t('wind.calm') : t(`wind.${this.getForce()}`, {bearing: this.bearing});
  }

  public isCalm() {
    return this.force == ForceScale.calm;
  }

  public isStorm() {
    return this.force == ForceScale.storm;
  }

  public isSpecial() {
    return this.isCalm() || this.isStorm();
  }

  public toVector(): Vector2d {
    return new Vector2d({x: this.direction.x, y: this.direction.y});
  }

  public follow(from: Coordinates) {
    return this.toVector().apply(from);
  }
}

export { Wind, ForceScale };
