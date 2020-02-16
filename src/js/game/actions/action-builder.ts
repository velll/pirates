import { Move } from "./move";
import { Capture } from "./capture";
import { Repair } from "./repair";
import { Shot } from "./shot";
import { Storm } from "./storm";
import { ActionRecord, Action, Game } from "../../game";
import { Board } from "../../board";
import { Turn } from "../turn";
import { Coordinates } from "../../lib/coordinates";
import { assert } from "../../lib/assert";
import { logger } from "../../lib/logger";

type DetailedBuilder = (game: Game, board: Board, turn: Turn, cell?: Coordinates) =>  Action;

class ActionBuilder {

  public readonly types: Record<string, DetailedBuilder> = {
      move: this.buildMove,
      shot: this.buildShot,
      capture: this.buildCapture,
      repair: this.buildRepair,
      storm: this.buildStorm
  };

  constructor(private readonly game: Game,
              private readonly board: Board) {
  }

  public getBuilder(type: string) {
    return this.types[type];
  }

  public buildOne(turn: Turn, record: ActionRecord): Action {
    logger.debug('building action from record');
    logger.debug(record);

    // assert(this.game.id == details.game_id, 'Cannot build action from a wrong game')
    // assert(turn.no == details.turn_no, 'Cannot build action from a wrong turn')

    return this.getBuilder(record.type)(
      this.game,
      this.board,
      turn,
     {x: record.cellx, y: record.celly});
  }

  public buildMove(game: Game, board: Board, turn: Turn, cell: Coordinates) {
    return new Move(game, board, turn, cell);
  }
  public buildShot(game: Game, board: Board, turn: Turn, cell: Coordinates) {
    return new Shot(game, board, turn, cell);
  }
  public buildCapture(game: Game, board: Board, turn: Turn) {
    return new Capture(game, board, turn);
  }
  public buildRepair(game: Game, board: Board, turn: Turn) {
    return new Repair(game, board, turn);
  }
  public buildStorm(game: Game, board: Board, turn: Turn, cell: Coordinates) {
    return new Storm(game, board, turn);
  }
  public build(turn: Turn, details: ActionRecord[]): Action[] {
    return details.map(line => this.buildOne(turn, line));
  }
}

export { ActionBuilder };
