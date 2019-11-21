import { Board } from "./board";
import { CanvasAdapter } from './lib/canvas/canvas-adapter';
import { Dimensions } from "./lib/dimensions";
import { GameMap, Features, MapConfig } from "./board/gamemap";
import { Grid, GridConfig } from "./board/grid";
import { Shipyard } from "./shipyard";

class BoardBuilder {
  private background: CanvasAdapter;
  private highlight: CanvasAdapter;
  private foreground: CanvasAdapter;

  constructor(background: CanvasAdapter, highlight: CanvasAdapter, foreground: CanvasAdapter) {
    this.background = background;
    this.highlight = highlight;
    this.foreground = foreground;
  }

  public build(features: Features,
               initialDimensions: Dimensions,
               shipyard: Shipyard,
               mapConfig: MapConfig,
               gridConfig: GridConfig): Board {
    const layers = {background: this.background, highlight: this.highlight, foreground: this.foreground};

    const map = new GameMap(mapConfig, features);
    const grid = new Grid(map, initialDimensions, gridConfig);

    const board = new Board(layers, map, grid, shipyard);

    return board;
  }
}

export { BoardBuilder };
