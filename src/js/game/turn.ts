import { Moveable } from '../game';
import { Coordinates, Move } from '../lib/coordinates';

import { includes } from '../lib/includes';
import { Wind } from './wind';

class Turn {
  public no: number;
  public ship: Moveable;
  public wind: Wind;

  public move: Move;
  public shot: Move;

  constructor(no: number, ship: Moveable, wind: Wind) {
    this.no = no;
    this.ship = ship;
    this.wind = wind;
    this.move = {from: ship.coordinates, to: {x: -1, y: -1}};
  }

  public makeMove(to: Coordinates) {
    this.move.to = to;
  }

  public makeShot(at: Coordinates) {
    this.shot = {from: this.ship.coordinates, to: at};
  }

  // a move is valid if "to" is in the list of available moves
  public isValidMove(to: Coordinates): boolean {
    return includes(this.getCellsForMove(), to);
  }
  public isValidShot(at: Coordinates): boolean {
    return includes(this.getCellsForShot(), at);
  }

  public getCellsForMove(): Coordinates[] {
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

  public getCellsForShot(): Coordinates[] {
    return this.ship.getShootingRange();
  }
}

export { Turn };
