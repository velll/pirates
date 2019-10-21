import { Board, Drawable, ShipModelsDict } from "./board";
import { Dimensions } from "./abstract/dimensions";
import { GameMap, Features } from "./board/gamemap";

class BoardBuilder {
  private canvas: Drawable;

  constructor(canvas: Drawable) {
    this.canvas = canvas;
  }

  public build(features: Features, initialDimensions: Dimensions, shipModels: ShipModelsDict): Board {
    const map = new GameMap(features);
    const board = new Board(this.canvas, map, initialDimensions, shipModels);

    return board;
  }
}

export { BoardBuilder };
