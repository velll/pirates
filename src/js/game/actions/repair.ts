import { Action, ActionType, Game } from "../../game";
import { Board } from "../../board";
import { Turn } from "../turn";
import { Ship } from "../ship";
import { UserInterface } from '../../ui';
import { AbstractAction } from "./abstract-action";

class Repair extends AbstractAction implements Action {
  public readonly actionType = ActionType.repair;

  private readonly ship: Ship;

  constructor(game: Game, board: Board, turn: Turn) {
    super(game, board, turn);
    this.ship = turn.ship;
  }

  public apply() {
    this.ship.repair();
  }

  public display() {
    this.game.UI.reportStatus(this.turn);
  }
}

export { Repair };
