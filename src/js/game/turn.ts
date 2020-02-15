import { Coordinates, Move } from '../lib/coordinates';
import { includes } from '../lib/includes';
import { Wind } from './wind';
import { filterOut } from '../lib/filter-out';
import { Ship } from './ship';
import { GameMap } from '../board/gamemap';
import { Action, ActionType, OffLimits } from '../game';

class Turn {
  public no: number;
  public date: Date;
  public ship: Ship;
  public wind: Wind;
  public finished: boolean = false;
  public availableMoves: Coordinates[];

  public actions: Action[];

  private offLimitCells: OffLimits;

  constructor(no: number, date: Date, ship: Ship, wind: Wind, movement: Coordinates[], offLimitCells: OffLimits) {
    this.no = no;
    this.date = date;
    this.ship = ship;
    this.wind = wind;
    this.offLimitCells = offLimitCells;

    this.availableMoves = filterOut(movement, offLimitCells.move);
    this.actions = [];
  }

  public hasMoved(): boolean {
    return !!this.actions.find(act => act.actionType == ActionType.move);
  }

  public hasShot(): boolean {
    return !!this.actions.find(act => act.actionType == ActionType.shot);
  }

  // a move is valid if "to" is in the list of available moves
  public isValidMove(to: Coordinates): boolean {
    return includes(this.availableMoves, to);
  }

  public isValidShot(at: Coordinates): boolean {
    return !this.hasShot() && includes(this.getCellsForShot(), at);
  }

  public getCellsForShot(): Coordinates[] {
    return filterOut(this.ship.getShootingRange(), this.offLimitCells.shot);
  }
}

export { Turn, OffLimits };
