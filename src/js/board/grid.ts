import { GameMap, Coordinates } from './gamemap';
import { Dimensions } from 'dimensions';

interface Position {
  top: number;
  left: number;
}

interface Grid {
  map: GameMap;

  dimensions: Dimensions;
  cellSize: number;
  startsAt: {x: number, y: number};
  colors: {[key: string]: string};
}

// cell size does change, so I'm calculating it below
class Grid {
  private mapXOffset = 0.03; // padding from left
  private mapYOffset = 0.07; // padding from top
  private mapXwidth  = 0.85; // width of active portion of the map
  private colorCode = {sea: "rgb(0,102,0,0.1)", rock: "rgba(255,73,73,0.5)", port: "rgba(1,1,1,0.5)"};

  constructor(map: GameMap,
              initialDimensions: Dimensions) {
    this.colors = this.colorCode;
    this.map = map;
    this.dimensions = initialDimensions;

    this.startsAt = {x: Math.round(this.dimensions.width * this.mapXOffset),
                     y: Math.round(this.dimensions.height * this.mapYOffset)};

    this.cellSize = Math.round(this.mapXwidth * this.dimensions.width / this.map.columns);
  }

  public getColor(coords: Coordinates): string {
    const feature: string = this.map.getFeatureByCoords(coords);

    return this.colors[feature];
  }

  public getCellPosition(coords: Coordinates): Position {
    return {left: this.startsAt.x + coords.x * this.cellSize,
            top: this.startsAt.x + coords.y * this.cellSize};
  }
}

export { Grid, Position };
