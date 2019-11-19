import { filter } from 'lodash';
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

  public static isSameCell(one: Coordinates, other: Coordinates): boolean {
    return (one.x == other.x && one.y == other.y);
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
    return this.getFeature({x: coords.x, y: coords.y});
  }

  public isPortOf(cell: Coordinates, fleet: string) {
    if (!this.isPort(cell)) { return false; }

    return this.getPort(cell).fleet == fleet;
  }

  private isPort(cell: Coordinates): boolean {
    return this.isFeature(cell, this.features.ports);
  }

  private isRock(cell: Coordinates): boolean {
    return this.isFeature(cell, this.features.rocks);
  }

  private getFeature(cell: Coordinates): string {
    // console.log("trying for a feature at" + cell.x + "," + cell.y);

    if (this.isRock(cell)) { return FeatureTypes.rock; }
    if (this.isPort(cell)) { return FeatureTypes.port; }
    return FeatureTypes.sea;
  }

  private getPort(cell: Coordinates): Port {
    return this.features.ports.filter((portCell) => {
             return (GameMap.isSameCell(portCell, cell));
           })[0];
  }

  private isFeature(cell: Coordinates, featureSet: Coordinates[]) {
    return filter(featureSet,
                 (featureCell) => {
                                   return (GameMap.isSameCell(featureCell, cell));
                                  }).length > 0;
  }
}

interface MapConfig {
  rows: number;
  columns: number;
}

interface Port extends Coordinates {
  name: string;
  fleet: string;
}

interface Features {
  ports: Port[];
  rocks: Coordinates[];
}

enum FeatureTypes {
  rock = "rock",
  port = "port",
  sea = "sea"
}

enum Fleets {
  spaniards,
  pirates
}

export { GameMap, Coordinates, Port, Features, MapConfig };
