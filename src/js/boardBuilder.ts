import { Board } from "./board";
import { Dimensions } from "board/dimensions";

class BoardBuilder {
  private ctx: CanvasRenderingContext2D;
  private initialDimensions: Dimensions;

  constructor(ctx: CanvasRenderingContext2D,
              initialWidth: number,
              initialHeight: number) {

    this.ctx = ctx;
    this.initialDimensions = {height: initialHeight, width: initialWidth};
  }

  public build(): Board {
    const board = new Board(this.ctx, this.initialDimensions);

    return board;
  }
}

export { BoardBuilder };
