import { Board } from "./board"
import { Dimensions } from "board/dimensions"

class BoardBuilder {
  ctx: CanvasRenderingContext2D;
  initialDimensions: Dimensions;

  constructor(ctx: CanvasRenderingContext2D,
              initialWidth: number,
              initialHeight: number) {
    
    this.ctx = ctx;
    this.initialDimensions = {height: initialHeight, width: initialWidth};
  }

  build(): Board {
    let board = new Board(this.ctx, this.initialDimensions);

    return board;
  }
}

export { BoardBuilder }