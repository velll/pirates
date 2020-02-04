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

  private readonly to: Coordinates;

  constructor(game: Game, board: Board, turn: Turn, to: Coordinates) {
    super(game, board, turn);

    this.from = turn.ship.coordinates;
    this.to = to;
    this.ship = turn.ship;
  }

  public apply() {
    this.ship.move(this.to);
  }

  public async display() {
    await this.board.moveShip(this.ship.view, this.from, this.to);
    this.board.drawShip(this.ship.view, this.to);
  }

  public after() {
    if (this.game.canCaptureGold()) {
      new Capture(this.game, this.board, this.turn).perform();
    }
  }

  public async perform() {
    await super.perform();

    this.after();
  }
}

export { Move };
