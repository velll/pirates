import { round } from './decimal-round';

class Vector2d {
  public x: number;
  public y: number;

  private readonly PRECISION = 3;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // x' = x cos θ − y sin θ
  // y' = x sin θ + y cos θ
  public rotate(angle: number): Vector2d {
    const x = this.x * this.cos(angle) - this.y * this.sin(angle);
    const y = this.x * this.sin(angle) + this.y * this.cos(angle);

    return new Vector2d(x, y);
  }

  // rough sine and cosine
  private sin(angle: number): number {
    return round(Math.sin((Math.PI / 180) * angle), this.PRECISION);
  }

  private cos(angle: number): number {
    return round(Math.cos((Math.PI / 180) * angle), this.PRECISION);
  }
}

export { Vector2d };
