import { GameMap } from "./board/gamemap"
import { Grid, Position } from "./board/grid"
import { Dimensions } from "./board/dimensions"

class Board {
  ctx: CanvasRenderingContext2D;
  map: GameMap;
  grid: Grid;

  constructor(ctx: CanvasRenderingContext2D, initialDimensions: Dimensions) {
    this.ctx = ctx;
    this.map = new GameMap();
    this.grid = new Grid (this.map, initialDimensions)
  }

  drawBox(x: number, y: number, l: number, h: number, color: string) {
    //console.log("drawing " + color + " box at " +  x + ", " + y + ". dimesions: " + l + ":" + h)

    this.ctx.beginPath();
    this.ctx.rect(x, y, l, h);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawCell(pos: Position, size: number, color: string) {
    this.drawBox(pos.left, pos.top, size, size, color);
  }

  drawGrid(){
    let color = "green";
    let startsAt = this.grid.startsAt;
    let size = this.grid.cellSize;

    for (var row: number = 0; row < this.map.rows; row++) {
      for (var col: number = 0; col < this.map.columns; col++) {
        
        let pos = {left: startsAt.x + col * size,
                    top: startsAt.y + row * size};

        this.drawCell(pos, size, color);
      }
    }
  }

}

export { Board }