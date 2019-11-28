import { Coordinates } from '../lib/coordinates';
import { Dimensions } from '../lib/dimensions';
import { Position } from '../lib/position';
import { GameMap } from './gamemap';

interface GridConfig {
  X_OFFSET: number; // padding from left
  Y_OFFSET: number; // padding from top
  X_WIDTH: number;  // width of active portion of the map
}

// cell size does change, so I'm calculating it below
class Grid {
  public cellSize: number;

  public readonly COLOR_CODE: Record<string, string> = {
    sea:  "rgba(0,102,0,0.1)",
    rock: "rgba(255,73,73,0.5)",
    port: "rgba(204,204,204, 0.8)"
  };

  private map: GameMap;
  private config: GridConfig;

  private dimensions: Dimensions;
  private startsAt: {x: number, y: number};

  constructor(map: GameMap,
              initialDimensions: Dimensions,
              config: GridConfig) {
    this.map = map;
    this.dimensions = initialDimensions;
    this.config = config;

    this.startsAt = {x: Math.round(this.dimensions.width * this.config.X_OFFSET),
                     y: Math.round(this.dimensions.height * this.config.Y_OFFSET)};

    this.cellSize = Math.round(this.config.X_WIDTH * this.dimensions.width / this.map.columns);
  }

  public getColor(coords: Coordinates): string {
    const feature: string = this.map.getFeatureByCoords(coords);

    return this.COLOR_CODE[feature];
  }

  public getCellPosition(coords: Coordinates): Position {
    return {left: this.startsAt.x + coords.x * this.cellSize,
            top: this.startsAt.y + coords.y * this.cellSize};
  }

  public getCellCenter(coords: Coordinates): Position {
    const position = this.getCellPosition(coords);

    return {left: position.left + this.cellSize / 2,
            top: position.top + this.cellSize / 2};
  }

  public offsetPosition(position: Position, offset: Dimensions): Position {
    return {left: position.left + offset.width, top: position.top + offset.height};
  }

  public getOffsettedPosition(coords: Coordinates, ratio: number) {
    const offset = this.cellSize * (1 - ratio) / 2;

    return this.offsetPosition(this.getCellPosition(coords), {width: offset, height: offset});
  }

  public locateCell(position: Position): Coordinates {
    return {x: Math.floor((position.left - this.startsAt.x) / this.cellSize),
            y: Math.floor((position.top - this.startsAt.y) / this.cellSize)};
  }
}

export { Grid, GridConfig };
