import { Action, ActionType, Game } from "../../game";
import { Board } from "../../board";
import { Turn } from "../turn";
import { Ship } from "../ship";
import { UserInterface } from '../../ui';
import { AbstractAction } from "./abstract-action";

class Repair extends AbstractAction implements Action {
  public readonly actionType = ActionType.repair;

  private readonly ship: Ship;
  private readonly UI: UserInterface;

  constructor(game: Game, board: Board, turn: Turn, UI: UserInterface) {
    super(game, board, turn);
    this.UI = UI;
    this.ship = turn.ship;
  }

  public apply() {
    this.ship.repair();
  }

  public display() {
    this.UI.reportStatus(this.turn);
  }
}

export { Repair };
