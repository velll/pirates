import { Board, Drawable, ShipModelsDict } from "./board";
import { Dimensions } from "./lib/dimensions";
import { GameMap, Features } from "./board/gamemap";

class BoardBuilder {
  private background: Drawable;
  private highlight: Drawable;
  private foreground: Drawable;

  constructor(background: Drawable, highlight: Drawable, foreground: Drawable) {
    this.background = background;
    this.highlight = highlight;
    this.foreground = foreground;
  }

  public build(features: Features, initialDimensions: Dimensions, shipModels: ShipModelsDict): Board {
    const map = new GameMap(features);
    const layers = {background: this.background, highlight: this.highlight, foreground: this.foreground};

    const board = new Board(layers, map, initialDimensions, shipModels);

    return board;
  }
}

export { BoardBuilder };
