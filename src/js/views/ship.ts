import { Drawable } from "../board";
import { CanvasAdapter } from "../lib/canvas/canvas-adapter";
import { Position } from "../lib/position";
import { Ship } from "../game/ship";
import { Design } from "../shipyard";
import { MovingImage } from "../lib/canvas/moving-image";

class ShipView implements Drawable {
  private model: Ship;
  private icons: Design[];

  private readonly SHIP_ICON_TO_CELL_RATIO = 0.8;
  private readonly SHIP_TO_HP_BAR_OFFSET = 0.05;
  private readonly HP_BAR_WIDTH_TO_CELL_RATIO = 0.05;

  constructor(model: Ship, icons: Design[]) {
    this.model = model;
    this.icons = icons;
  }

  public draw(layer: CanvasAdapter, position: Position, cellSize: number) {
    if (this.model.isSunk()) { return; } // you cannot see sunken ships

    const iconPosition = this.getIconPosition(position, cellSize);
    const iconSize = this.getIconSize(cellSize);

    layer.clearSquare(position, cellSize);
    layer.drawImage(this.getIcon(), iconPosition, this.getIconSize(cellSize));

    this.drawHPBar(layer, iconPosition, iconSize, cellSize);
  }

  public drawMove(layer: CanvasAdapter, from: Position, to: Position, cellSize: number): void {
    const start = this.getIconPosition(from, cellSize);
    const finish = this.getIconPosition(to, cellSize);

    const animation = new MovingImage(layer, this.getIcon(), this.getIconSize(cellSize));
    animation.run(start, finish);
  }

  private drawHPBar(layer: CanvasAdapter, position: Position, size: number, cellSize: number) {
    const start = {left: position.left,
          top: position.top +
          cellSize * (this.SHIP_ICON_TO_CELL_RATIO + this.SHIP_TO_HP_BAR_OFFSET)};
    const green = Math.round(size * this.model.HP / this.model.maxHP);

    const finish = {left: start.left + size, top: start.top};
    const lineWidth = cellSize * this.HP_BAR_WIDTH_TO_CELL_RATIO;

    layer.drawLine(start, {left: start.left + green, top: start.top}, "green", lineWidth);
    if (this.model.HP != this.model.maxHP) {
    layer.drawLine({left: start.left + green, top: start.top}, finish, "red", lineWidth);
    }
  }

  private getIconPosition(position: Position, cellSize: number): Position {
    const offset = (cellSize - this.getIconSize(cellSize)) / 2;
    return {left: position.left + offset, top: position.top + offset};
  }

  private getIconSize(cellSize: number): number {
    return cellSize * this.SHIP_ICON_TO_CELL_RATIO;
  }

  private getIcon(): CanvasImageSource {
    return this.icons.filter(icon => (
      icon.fleet.is(this.model.fleet) &&
      icon.golden == this.model.isGolden() &&
      icon.wreck == this.model.isWrecked()
    ))[0].icon;
  }
}

export { ShipView };
