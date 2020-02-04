import { Action, Game, ActionType } from "../../game";
import { Board } from "../../board";
import { Turn } from "../turn";
import { Ship } from "../ship";
import { Coordinates } from "../../lib/coordinates";
import { CannonballView } from "../../views/cannonball";
import { Capture } from "./capture";
import { AbstractAction } from "./abstract-action";

class Shot extends AbstractAction implements Action {
  public readonly actionType = ActionType.shot;

  private readonly from: Coordinates;
  private readonly to: Coordinates;

  private readonly ship: Ship;
  private readonly target: Ship;

  constructor(game: Game, board: Board, turn: Turn, to: Coordinates) {
    super(game, board, turn);

    this.to = to;
    this.ship = turn.ship;
    this.from = turn.ship.coordinates;

    this.target = this.game.findShipByCoordinates(this.to);
  }

  public apply() {
    this.target.damage();
  }

  public async display() {
    const cannonball = new CannonballView();

    await this.board.shoot(cannonball, this.ship.coordinates, this.to);

    this.board.drawShip(this.target.view, this.target.coordinates);
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

export { Shot };
