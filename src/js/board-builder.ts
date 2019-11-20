import { Board, Drawable, ShipModelsDict } from "./board";
import { Dimensions } from "./lib/dimensions";
import { GameMap, Features, MapConfig } from "./board/gamemap";
import { Grid, GridConfig } from "./board/grid";

class BoardBuilder {
  private background: Drawable;
  private highlight: Drawable;
  private foreground: Drawable;

  constructor(background: Drawable, highlight: Drawable, foreground: Drawable) {
    this.background = background;
    this.highlight = highlight;
    this.foreground = foreground;
  }

  public build(features: Features,
               initialDimensions: Dimensions,
               shipModels: ShipModelsDict,
               wreckModels: ShipModelsDict,
               mapConfig: MapConfig,
               gridConfig: GridConfig): Board {
    const layers = {background: this.background, highlight: this.highlight, foreground: this.foreground};

    const map = new GameMap(mapConfig, features);
    const grid = new Grid(map, initialDimensions, gridConfig);

    const board = new Board(layers, map, grid, shipModels, wreckModels);

    return board;
  }
}

export { BoardBuilder };
