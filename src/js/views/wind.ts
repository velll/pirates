import { Drawable } from "../board";
import { Wind } from "../game/wind";
import { CanvasAdapter } from "../lib/canvas/canvas-adapter";
import { Position } from "../lib/position";
import { DOM } from "../lib/dom/dom";

class WindView implements Drawable {
  private wind: Wind;

  constructor(wind: Wind) {
    this.wind = wind;
  }

  public draw(layer: CanvasAdapter, position: Position, cellSize: number) {
    const size = cellSize * 2;

    const pos = {left: position.left - cellSize / 2,
                 top: position.top - cellSize / 2};

    layer.drawImage(this.getImage(), pos, size, false);
  }

  public getImage(): CanvasImageSource {
    return DOM.$(`wind-${this.wind.getName()}`) as CanvasImageSource;
  }
}

export { WindView };
