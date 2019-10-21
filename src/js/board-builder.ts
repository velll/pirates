import { Board, ShipModelsDict } from "./board";
import { Dimensions } from "board/dimensions";
import { GameMap, Features } from "./board/gamemap";

class BoardBuilder {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public build(features: Features, initialDimensions: Dimensions, shipModels: ShipModelsDict): Board {
    const map = new GameMap(features);
    const board = new Board(this.ctx, map, initialDimensions, shipModels);

    return board;
  }
}

export { BoardBuilder };
