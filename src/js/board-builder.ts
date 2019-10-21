import { Board, Drawable, ShipModelsDict } from "./board";
import { Dimensions } from "./lib/dimensions";
import { GameMap, Features } from "./board/gamemap";

class BoardBuilder {
  private background: Drawable;
  private foreground: Drawable;

  constructor(background: Drawable, foreground: Drawable) {
    this.background = background;
    this.foreground = foreground;
  }

  public build(features: Features, initialDimensions: Dimensions, shipModels: ShipModelsDict): Board {
    const map = new GameMap(features);
    const board = new Board(this.background, this.foreground, map, initialDimensions, shipModels);

    return board;
  }
}

export { BoardBuilder };
