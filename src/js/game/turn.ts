import { Coordinates, Move } from '../lib/coordinates';
import { includes } from '../lib/includes';
import { Wind } from './wind';
import { filterOut } from '../lib/filter-out';
import { Ship } from './ship';
import { GameMap } from '../board/gamemap';
import { Action, ActionType, OffLimits, ActionRecord } from '../game';

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

  public hasDone(what: ActionType): boolean {
    return !!this.actions.find(act => act.actionType == what);
  }

  public hasMoved(): boolean {
    return this.hasDone(ActionType.move);
  }

  public hasShot(): boolean {
    return this.hasDone(ActionType.shot);
  }

  public hasRepaired(): boolean {
    return this.hasDone(ActionType.repair);
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

  // Not much can actually change
  public update(turn: Turn): Turn {
    this.finished = turn.finished;
    this.actions = turn.actions;

    return this;
  }
}

interface TurnRecord {
  game_id: string;
  turn_no: number;
  fleet: string;
  ship_index: number;
  wind_bearing: string;
  wind_force: number;
  finished: boolean;
  actions: ActionRecord[]
}

export { Turn, TurnRecord, OffLimits };
