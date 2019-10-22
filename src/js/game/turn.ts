import { Moveable } from '../game';
import { Coordinates, Move } from '../lib/coordinates';

class Turn {
  public no: number;
  public ship: Moveable;
  public move: Move;
  public shot: Move;

  constructor(no: number, ship: Moveable) {
    this.no = no;
    this.ship = ship;
    this.move = {from: ship.coordinates, to: {x: -1, y: -1}};
  }

  public makeMove(to: Coordinates) {
    this.move.to = to;
  }

  public makeShot(at: Coordinates) {
    this.shot = {from: this.ship.coordinates, to: at};
  }
}

export { Turn };
