import { GameMap, Coordinates } from './gamemap';
import { Dimensions } from 'dimensions'

interface Position {
  top: number,
  left: number
}

interface Grid {
  map: GameMap;
  
  dimensions: Dimensions;
  cellSize: number;
  startsAt: {x: number, y: number};
  colors: {[key:string]: string;};
}

// cell size does change, so I'm calculating it below
class Grid {
  startsAt = {x: 100, y: 100}
  cellSize = 100;

  constructor(map: GameMap,
              initialDimensions: Dimensions) {
    this.map = map;
    this.dimensions = initialDimensions;
  }
}

export { Grid, Position }