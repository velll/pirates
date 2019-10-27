import { Moveable } from '../game';
import { Coordinates, Move } from '../lib/coordinates';

import { findIndex, isMatch } from 'lodash';

class Turn {
  public no: number;
  public ship: Moveable;
  public move: Move;
  public shot: Move;

  public availableForMove: Coordinates[];
  public availableForShot: Coordinates[];

  constructor(no: number, ship: Moveable) {
    this.no = no;
    this.ship = ship;
    this.move = {from: ship.coordinates, to: {x: -1, y: -1}};

    this.availableForMove = this.findCellsForMove();
    this.availableForShot = this.findCellsForShot();
  }

  public makeMove(to: Coordinates) {
    this.move.to = to;
  }

  public makeShot(at: Coordinates) {
    this.shot = {from: this.ship.coordinates, to: at};
  }

  // a move is valid if "to" is in the list of available moves
  public isValidMove(to: Coordinates): boolean {
    return findIndex(this.availableForMove, (cell) => {
             return isMatch(cell, to);
           }) > -1;
  }

  private findCellsForMove(): Coordinates[] {
    // for now just 8 cells around the ship are available
    return [
      {x: this.ship.coordinates.x - 1, y: this.ship.coordinates.y - 1},
      {x: this.ship.coordinates.x - 1, y: this.ship.coordinates.y},
      {x: this.ship.coordinates.x - 1, y: this.ship.coordinates.y + 1},
      {x: this.ship.coordinates.x,     y: this.ship.coordinates.y - 1},
      // this.ship.coordinates is not available
      {x: this.ship.coordinates.x,     y: this.ship.coordinates.y + 1},
      {x: this.ship.coordinates.x + 1, y: this.ship.coordinates.y - 1},
      {x: this.ship.coordinates.x + 1, y: this.ship.coordinates.y},
      {x: this.ship.coordinates.x + 1, y: this.ship.coordinates.y + 1}
    ];
  }

  private findCellsForShot(): Coordinates[] {
    // same as moves for now
    return this.findCellsForMove();
  }
}

export { Turn };
