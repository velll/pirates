import { Action, ActionType, Game } from "../../game";
import { Board } from "../../board";
import { Turn } from "../turn";
import { AbstractAction } from "./abstract-action";
import { Fleet } from "../fleet";

class Surrender extends AbstractAction implements Action {
  public readonly actionType = ActionType.surrender;

  constructor(game: Game, board: Board, turn: Turn) {
    super(game, board, turn);
  }

  public apply() {
  }

  public display() {
    const currentFleet = this.turn.ship.fleet;

    const enemy = Fleet.getEnemyFleet(currentFleet);
    this.game.UI.congratulate(enemy);
  }
}

export { Surrender };
