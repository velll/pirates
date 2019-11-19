import { round } from './decimal-round';

// Weird 2d vectors for an integer space.
// Basically the only purpose of this class is
// to rotate vectors as we know the vectors
// should be rotated:
//
// x' = x cos θ − y sin θ
// y' = x sin θ + y cos θ
//
// But as we're dealing with a space of integers
// all the vector coordinates are then quantized to [-1, 0, 1]
class Vector2d {
  public x: number;
  public y: number;

  private readonly PRECISION = 3;

  constructor(vector: {x: number, y: number}) {
    this.x = vector.x;
    this.y = vector.y;
  }

  // angle is in degrees, they're converted to rad inside
  public rotate(angle: number): Vector2d {
    const x = this.x * this.cos(angle) - this.y * this.sin(angle);
    const y = this.x * this.sin(angle) + this.y * this.cos(angle);

    return new Vector2d({x: this.integerize(x), y: this.integerize(y)});
  }

  // quantize a vector coordinate to [-1, 0, 1]
  public integerize(num: number) {
    // round them first so as not to deal with floating point fuckery
    const rounded = round(num, this.PRECISION);

    return Math.sign(rounded);
  }

  private sin(angle: number): number {
    return Math.sin((Math.PI / 180) * angle);
  }

  private cos(angle: number): number {
    return Math.cos((Math.PI / 180) * angle);
  }
}

export { Vector2d };
