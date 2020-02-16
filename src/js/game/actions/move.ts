import { Action, ActionType, Game } from "../../game";
import { AbstractAction } from "./abstract-action";

import { Board } from "../../board";
import { Coordinates } from "../../lib/coordinates";
import { Turn } from "../turn";
import { Ship } from "../ship";

import { Capture } from "./capture";

class Move extends AbstractAction implements Action {
  public readonly actionType = ActionType.move;

  private readonly from: Coordinates;
  private readonly ship: Ship;

  // 'cell' — is a cell to which the ship is moving (to)

  constructor(game: Game, board: Board, turn: Turn, cell: Coordinates) {
    super(game, board, turn, cell);

    this.ship = turn.ship;
    this.from = turn.ship.coordinates;
  }

  public apply() {
    this.ship.move(this.cell);
  }

  public async display() {
    await this.board.moveShip(this.ship.view, this.from, this.cell);
    this.board.drawShip(this.ship.view, this.cell);
  }

  public after() {
    if (this.game.canCaptureGold()) {
      new Capture(this.game, this.board, this.turn).perform();
    }
  }

  public async perform(persist = true) {
    await super.perform(persist);

    this.after();
  }
}

export { Move };
