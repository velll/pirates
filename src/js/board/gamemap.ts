import { filter } from 'lodash';
import { Features } from './features';
import { Cell } from './cell';

interface Coordinates {
  x: number;
  y: number;
}

interface Map {
  rows: number;
  columns: number;
}

// GameMap holds board data — how many cells in a row/column and
// special features of the cells
class GameMap implements Map {
  public rows: number = 25;
  public columns: number = 37;

  private features: Features;

  constructor(features: Features) {
    this.features = features;
  }

  public isPort(cell: Cell): boolean {
    return this.isFeature(cell, this.features.ports);
  }

  public isRock(cell: Cell): boolean {
    return this.isFeature(cell, this.features.rocks);
  }

  public getFeature(cell: Cell): string {
    // console.log("trying for a feature at" + cell.x + "," + cell.y);

    if (this.isRock(cell)) { return "rock"; }
    if (this.isPort(cell)) { return "port"; }
    return "sea";
  }

  public getFeatureByCoords(coords: Coordinates): string {
    return this.getFeature(new Cell(coords.x, coords.y));
  }

  private isFeature(cell: Cell, featureSet: Cell[]) {
    return filter(featureSet,
                 (featureCell) => {
                                   return (featureCell.equalTo(cell));
                                  }).length > 0;
  }
}

export { GameMap, Coordinates };
