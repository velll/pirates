import { filter, range, flatten, isEqual } from 'lodash';
import { Coordinates } from '../lib/coordinates';
import { Fleet } from '../game/fleet';
import { Port } from './port';

// GameMap holds board data — how many cells in a row/column and
// special features of the cells
class GameMap {
  public static dummyCell = {x: -1, y: -1};

  public static getCellsAround(coords: Coordinates, radius = 1): Coordinates[] {
    const rng: number[] = range(-radius, radius + 1);

    // multiply length by width to get a square of cells
    const square = flatten(
                     rng.map(dy => (
                       rng.map(dx => ({x: coords.x + dx, y: coords.y + dy})))));

    // exclude the cell in the center
    return square.filter(el => (!GameMap.isSameCell(el, coords)));
  }

  public static isSameCell(one: Coordinates, other: Coordinates): boolean {
    return (one.x == other.x && one.y == other.y);
  }

  public rows: number;
  public columns: number;

  private features: Features;

  constructor(config: MapConfig, rocks: Coordinates[], ports: Port[]) {
    this.rows = config.rows;
    this.columns = config.columns;

    this.features = {ports: ports, rocks: rocks};
  }

  public getFeatureByCoords(coords: Coordinates): string {
    return this.getFeature({x: coords.x, y: coords.y});
  }

  public getPorts(): Port[] {
    return this.features.ports;
  }

  public getRocks(): Coordinates[] {
    return this.features.rocks;
  }

  public isPortOf(cell: Coordinates, fleet: Fleet) {
    if (!this.isPort(cell)) { return false; }

    return isEqual(this.getPort(cell).fleet, fleet);
  }

  public isPort(cell: Coordinates): boolean {
    return this.isFeature(cell, this.features.ports.map(port => port.coordinates));
  }

  public isRock(cell: Coordinates): boolean {
    return this.isFeature(cell, this.features.rocks);
  }

  public isOnMap(cell: Coordinates): boolean {
    return cell.x >= 0 && cell.x < this.columns &&
           cell.y >= 0 && cell.y < this.rows;
  }

  public getPort(coordinates: Coordinates): Port {
    return this.features.ports.filter(port =>
             GameMap.isSameCell(port.coordinates, coordinates)
           )[0];
  }

  private getFeature(cell: Coordinates): string {
    // console.log("trying for a feature at" + cell.x + "," + cell.y);

    if (this.isRock(cell)) { return FeatureTypes.rock; }
    if (this.isPort(cell)) { return FeatureTypes.port; }
    return FeatureTypes.sea;
  }

  private isFeature(cell: Coordinates, featureSet: Coordinates[]) {
    return filter(featureSet, featureCell => {
                                   return (GameMap.isSameCell(featureCell, cell));
                                  }).length > 0;
  }
}

interface MapConfig {
  rows: number;
  columns: number;
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

export { GameMap, Port, Features, MapConfig };
