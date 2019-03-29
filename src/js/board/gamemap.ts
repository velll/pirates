import { range, filter, concat } from 'lodash';
import { Features, features } from './features';
import { Cell } from './cell';

interface Coordinates {
  x: number,
  y: number
}

interface Map {
  rows: number,
  columns: number,
  features: Features
}

// GameMap holds board data — how many cells in a row/column and
// special features of the cells
class GameMap implements Map {
  rows: number = 25;
  columns: number = 37;
  features: Features;

  constructor(features: Features) {
    this.features = features;
  }

  isFeature(cell: Cell, featureSet: typeof features.rocks){
    return filter(featureSet, function(featureCell) {
      return (featureCell.equalTo(cell));
    }).length > 0;
  }

  isPort(cell: Cell): boolean {
    return this.isFeature(cell, this.features.ports);
  }

  isRock(cell: Cell): boolean {
    return this.isFeature(cell, this.features.rocks);
  }

  getFeature(cell: Cell): string {
    // console.log("trying for a feature at" + cell.x + "," + cell.y);
    
    if (this.isRock(cell)) { return "rock"; }
    if (this.isPort(cell)) { return "port"; }
    return "sea";
  }

  getFeatureByCoords(coords: Coordinates): string {
    return this.getFeature(new Cell(coords.x, coords.y));
  }
}

export { GameMap, Coordinates }