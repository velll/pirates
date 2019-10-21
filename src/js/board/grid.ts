import { Coordinates } from '../abstract/coordinates';
import { Dimensions } from '../abstract/dimensions';
import { Position } from '../abstract/position';
import { GameMap } from './gamemap';

interface Grid {
  map: GameMap;

  dimensions: Dimensions;
  cellSize: number;
  startsAt: {x: number, y: number};
  colors: {[key: string]: string};
}

// cell size does change, so I'm calculating it below
class Grid {
  private readonly X_OFFSET = 0.0065; // padding from left
  private readonly Y_OFFSET = 0.043; // padding from top
  private readonly X_WIDTH  = 0.9; // width of active portion of the map
  private readonly COLOR_CODE = {
    sea: "rgb(0,102,0,0.1)",
    rock: "rgba(255,73,73,0.5)",
    port: "rgba(1,1,1,0.5)"
  };

  constructor(map: GameMap,
              initialDimensions: Dimensions) {
    this.colors = this.COLOR_CODE;
    this.map = map;
    this.dimensions = initialDimensions;

    this.startsAt = {x: Math.round(this.dimensions.width * this.X_OFFSET),
                     y: Math.round(this.dimensions.height * this.Y_OFFSET)};

    this.cellSize = Math.round(this.X_WIDTH * this.dimensions.width / this.map.columns);
  }

  public getColor(coords: Coordinates): string {
    const feature: string = this.map.getFeatureByCoords(coords);

    return this.colors[feature];
  }

  public getCellPosition(coords: Coordinates): Position {
    return {left: this.startsAt.x + coords.x * this.cellSize,
            top: this.startsAt.y + coords.y * this.cellSize};
  }
}

export { Grid, Position };
