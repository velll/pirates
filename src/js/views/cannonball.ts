import { Moveable } from '../board';
import { CanvasAdapter } from '../lib/canvas/canvas-adapter';
import { MovingImage } from '../lib/canvas/moving-image';
import { Position } from '../lib/position';
import { $ } from 'dollarsigns';

class CannonballView implements Moveable {
  private readonly ICON_TO_CELL_RATIO = 0.5;
  private img: CanvasImageSource;

  constructor() {
    this.img = $('cannonball') as CanvasImageSource;
  }

  public drawMove(layer: CanvasAdapter, from: Position, to: Position, cellSize: number) {
    const start = this.getIconPosition(from, cellSize);
    const finish = this.getIconPosition(to, cellSize);

    const animation = new MovingImage(layer, this.img, this.getIconSize(cellSize));

    return animation.run(start, finish);
  }

  private getIconPosition(position: Position, cellSize: number): Position {
    const offset = (cellSize - this.getIconSize(cellSize)) / 2;
    return {left: position.left + offset, top: position.top + offset};
  }

  private getIconSize(cellSize: number): number {
    return cellSize * this.ICON_TO_CELL_RATIO;
  }
}

export { CannonballView };
