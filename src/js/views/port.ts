import { Drawable } from "../board";
import { CanvasAdapter } from "../lib/canvas/canvas-adapter";
import { Position } from "../lib/position";
import { Port } from "../board/port";

class PortView implements Drawable {
  private model: Port;
  private flag: CanvasImageSource;

  private readonly PORT_CROSS_TO_CELL_RATIO = 0.8;
  private readonly PORT_FLAG_TO_CELL_RATIO = 0.5;
  private readonly PORT_FLAG_TO_CELL_OFFSET = 0.25;
  private readonly PORT_COLOR = "rgba(204,204,204, 0.8)";

  constructor(model: Port, flag: CanvasImageSource) {
    this.model = model;
    this.flag = flag;
  }

  public draw(layer: CanvasAdapter, position: Position, cellSize: number) {
    layer.drawSquare(position, cellSize, this.PORT_COLOR);

    const offsettedPos = this.getCrossPosition(position, cellSize);
    const offsettedWidth = this.getCrossSize(cellSize);

    layer.drawCross(offsettedPos, offsettedWidth);

    this.drawFlag(layer, position, cellSize);
  }

  private drawFlag(layer: CanvasAdapter, position: Position, cellSize: number) {
    const flagSize = cellSize * this.PORT_FLAG_TO_CELL_RATIO;

    const flagPos = {left: position.left + flagSize,
                     top: position.top - cellSize * this.PORT_FLAG_TO_CELL_OFFSET};

    layer.drawLine(flagPos, {left: flagPos.left, top: flagPos.top + flagSize});
    layer.drawImage(this.flag, flagPos, flagSize);
  }

  private getCrossPosition(position: Position, cellSize: number): Position {
    const offset = (cellSize - this.getCrossSize(cellSize)) / 2;
    return {left: position.left + offset, top: position.top + offset};
  }

  private getCrossSize(cellSize: number): number {
    return cellSize * this.PORT_CROSS_TO_CELL_RATIO;
  }
}

export { PortView };
