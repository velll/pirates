import { Action, ActionType } from "../../game";
import { Ship } from "../ship";
import { AbstractAction } from "./abstract-action";

class Capture extends AbstractAction implements Action {
  public readonly actionType = ActionType.capture;

  private goldenShip: Ship;

  public apply() {
    this.goldenShip = this.game.captureGoldenShip();
  }

  public display() {
    this.board.drawShip(this.goldenShip.view, this.goldenShip.coordinates);
  }
}

export { Capture };
