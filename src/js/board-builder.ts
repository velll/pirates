import { Board } from "./board";
import { CanvasAdapter } from './lib/canvas/canvas-adapter';
import { Dimensions } from "./lib/dimensions";
import { GameMap, Features, MapConfig, Port } from "./board/gamemap";
import { Grid, GridConfig } from "./board/grid";
import { Shipyard } from "./shipyard";
import { Coordinates } from "./lib/coordinates";

class BoardBuilder {
  private background: CanvasAdapter;
  private highlight: CanvasAdapter;
  private ships: CanvasAdapter;
  private foreground: CanvasAdapter;

  constructor(background: CanvasAdapter, highlight: CanvasAdapter, ships: CanvasAdapter, foreground: CanvasAdapter) {
    this.background = background;
    this.highlight = highlight;
    this.ships = ships;
    this.foreground = foreground;
  }

  public buildMap(mapConfig: MapConfig, rocks: Coordinates[], ports: Port[]){
    return new GameMap(mapConfig, rocks, ports);
  }

  public buildGrid(map: GameMap, gridConfig: GridConfig, initialDimensions: Dimensions) {
    return new Grid(map, initialDimensions, gridConfig);
  }

  public build(map: GameMap, grid: Grid): Board {
    const layers = {background: this.background,
                    highlight: this.highlight,
                    ships: this.ships,
                    foreground: this.foreground};

    const board = new Board(layers, map, grid);

    return board;
  }
}

export { BoardBuilder };
