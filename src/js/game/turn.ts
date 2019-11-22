import { Moveable } from '../game';
import { Coordinates, Move } from '../lib/coordinates';

import { includes } from '../lib/includes';
import { Wind } from './wind';
import { filterOut } from '../lib/filter-out';

class Turn {
  public no: number;
  public ship: Moveable;
  public wind: Wind;
  public cellsForMove: Coordinates[];

  public move: Move;
  public shot: Move;

  private offLimitCells: OffLimits;

  constructor(no: number, ship: Moveable, wind: Wind, offLimitCells: OffLimits) {
    this.no = no;
    this.ship = ship;
    this.wind = wind;
    this.offLimitCells = offLimitCells;

    this.cellsForMove = filterOut(
                          this.ship.getMovingRange(this.wind),
                          offLimitCells.move);
  }

  public makeMove(to: Coordinates) {
    this.move = {from: this.ship.coordinates, to: to};
    this.ship.move(to);
  }

  public makeShot(at: Coordinates) {
    this.shot = {from: this.ship.coordinates, to: at};
  }

  public hasMoved(): boolean {
    return !!this.move;
  }

  public hasShot(): boolean {
    return !!this.shot;
  }

  // a move is valid if "to" is in the list of available moves
  public isValidMove(to: Coordinates): boolean {
    return includes(this.cellsForMove, to);
  }

  public isValidShot(at: Coordinates): boolean {
    return !this.hasShot() && includes(this.getCellsForShot(), at);
  }

  public getCellsForShot(): Coordinates[] {
    return filterOut(this.ship.getShootingRange(), this.offLimitCells.shot);
  }
}

interface OffLimits {
  move: Coordinates[],
  shot: Coordinates[]
}

export { Turn };
