import { GameMap, Coordinates } from "./board/gamemap"
import { Grid, Position } from "./board/grid"
import { Dimensions } from "./board/dimensions"
import { features, Features } from "./board/features"

class Board {
  ctx: CanvasRenderingContext2D;
  map: GameMap;
  grid: Grid;

  constructor(ctx: CanvasRenderingContext2D, initialDimensions: Dimensions) {
    this.ctx = ctx;
    this.map = new GameMap(features);
    this.grid = new Grid (this.map, initialDimensions)
  }

  drawBox(x: number, y: number, l: number, h: number, color: string) {
    //console.log("drawing " + color + " box at " +  x + ", " + y + ". dimesions: " + l + ":" + h)

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, l, h);
  }

  drawCell(pos: Position, size: number, color: string) {
    this.drawBox(pos.left, pos.top, size, size, color);
  }


  drawGrid(){
    let cellSize = this.grid.cellSize
    
    for (var row: number = 0; row < this.map.rows; row++) {
      for (var col: number = 0; col < this.map.columns; col++) {
        let color = this.grid.getColor({x: col, y: row});
        let pos = this.grid.getCellPosition({x: col, y: row});

        this.drawCell(pos, cellSize, color);
      }
    }
  }

}

export { Board }