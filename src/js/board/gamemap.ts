import { filter } from 'lodash';
import { Cell } from './cell';
import { Coordinates } from '../lib/coordinates';

// GameMap holds board data — how many cells in a row/column and
// special features of the cells
class GameMap {

  public static getCellsAround(coords: Coordinates): Coordinates[] {
    return [
      {x: coords.x - 1, y: coords.y - 1},
      {x: coords.x - 1, y: coords.y},
      {x: coords.x - 1, y: coords.y + 1},
      {x: coords.x,     y: coords.y - 1},
      // not the cell itself
      {x: coords.x,     y: coords.y + 1},
      {x: coords.x + 1, y: coords.y - 1},
      {x: coords.x + 1, y: coords.y},
      {x: coords.x + 1, y: coords.y + 1}
    ];
  }
  public rows: number;
  public columns: number;

  private features: Features;

  constructor(config: MapConfig, features: Features) {
    this.rows = config.rows;
    this.columns = config.columns;

    this.features = features;
  }

  public getFeatureByCoords(coords: Coordinates): string {
    return this.getFeature(new Cell(coords.x, coords.y));
  }

  private isPort(cell: Cell): boolean {
    return this.isFeature(cell, this.features.ports);
  }

  private isRock(cell: Cell): boolean {
    return this.isFeature(cell, this.features.rocks);
  }

  private getFeature(cell: Cell): string {
    // console.log("trying for a feature at" + cell.x + "," + cell.y);

    if (this.isRock(cell)) { return "rock"; }
    if (this.isPort(cell)) { return "port"; }
    return "sea";
  }

  private isFeature(cell: Cell, featureSet: Cell[]) {
    return filter(featureSet,
                 (featureCell) => {
                                   return (featureCell.equalTo(cell));
                                  }).length > 0;
  }
}

interface MapConfig {
  rows: number;
  columns: number;
}

interface Features {
  ports: Cell[];
  rocks: Cell[];
}

export { GameMap, Features, MapConfig };
