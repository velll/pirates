import { MapArea } from "../board/gamemap";
import { Coordinates } from "../lib/coordinates";
import { range, flatten } from 'lodash';
import { assert } from "../lib/assert";

class Area implements MapArea {

  // Build a square area containing given cells
  public static build(cells: Coordinates[]): Area {
    const leftTop = {x: Math.min(...cells.map(el => el.x)),
                     y: Math.min(...cells.map(el => el.y))};

    const rightBottom = {x: Math.max(...cells.map(el => el.x)),
                         y: Math.max(...cells.map(el => el.y))};

    return new Area(leftTop, rightBottom);
  }

  constructor(public start: Coordinates, public end: Coordinates) {
    assert(end.x >= start.x && end.y >= start.y, "Area must be positive: from top left to bottom right");
  }

  public get cells(): Coordinates[] {
    return flatten(range(this.start.x, this.end.x + 1).map(cx => (
                     range(this.start.y, this.end.y + 1).map(cy => (
                       {x: cx, y: cy}
                     ))
                   )));
  }

  public get width() {
    return this.end.x - this.start.x + 1;
  }

  public get height() {
    return this.end.y - this.start.y + 1;
  }

  public expand(by: number): Area {
    const newLeftTop = {x: this.start.x - by, y: this.start.y - by};
    const newRightBottom = {x: this.end.x + by, y: this.end.y + by};

    return new Area(newLeftTop, newRightBottom);
  }
}

export { Area };
