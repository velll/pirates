import { GameMap, Coordinates } from "./board/gamemap";
import { Grid, Position } from "./board/grid";
import { Dimensions } from "./board/dimensions";

class Board {
  private ctx: CanvasRenderingContext2D;
  private map: GameMap;
  private grid: Grid;

  constructor(ctx: CanvasRenderingContext2D, map: GameMap, initialDimensions: Dimensions) {
    this.ctx = ctx;
    this.map = map;
    this.grid = new Grid (this.map, initialDimensions);
  }

  public drawBox(x: number, y: number, l: number, h: number, color: string) {
    // console.log("drawing " + color + " box at " +  x + ", " + y + ". dimesions: " + l + ":" + h)

    this.ctx.beginPath();
    this.ctx.rect(x, y, l, h);
    this.ctx.strokeStyle = "grey";
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, l, h);
  }

  public drawCell(pos: Position, size: number, color: string) {
    this.drawBox(pos.left, pos.top, size, size, color);
  }

  public drawGrid() {
    const cellSize = this.grid.cellSize;

    for (let row: number = 0; row < this.map.rows; row++) {
      for (let col: number = 0; col < this.map.columns; col++) {
        const color = this.grid.getColor({x: col, y: row});
        const pos = this.grid.getCellPosition({x: col, y: row});

        this.drawCell(pos, cellSize, color);
        this.drawCoords(pos, cellSize, {x: col, y: row});
      }
    }
  }

  private drawCoords(pos: Position, size: number, coords: Coordinates) {
    this.ctx.font = "15px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(coords.x + "," + coords.y, pos.left + size / 3, pos.top + size / 3);
  }
}

export { Board };
