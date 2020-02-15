import { Action, Game, ActionType } from "../../game";
import { Board } from "../../board";
import { Turn } from "../turn";
import { t } from '../../data/i18n';
import { Coordinates } from "../../lib/coordinates";
import { Move } from "./move";
import { UserInterface } from "../../UI";
import { Ship } from "../ship";
import { AbstractAction } from "./abstract-action";

class Storm extends AbstractAction implements Action {
  public readonly actionType = ActionType.storm;

  private readonly UI: UserInterface;
  private readonly caught: boolean;
  private readonly ship: Ship;
  private readonly from: Coordinates;
  private readonly to: Coordinates;

  constructor(game: Game, board: Board, turn: Turn) {
    super(game, board, turn);

    this.UI = game.UI;
    this.ship = turn.ship;
    this.caught = this.game.isCaughtInStorm(this.turn);
    this.from = this.turn.ship.coordinates;
    this.to = this.caught ? this.turn.wind.follow(this.turn.ship.coordinates) : this.from;
  }

  public apply() {
    if (this.board.isRock(this.to) || !this.board.isOnMap(this.to)) {
      this.ship.damage();
      this.ship.damage();
      this.ship.damage();
    }
  }

  public display(silent = false) {
    if (silent) { return; }

    const key = this.caught ? "messages.storm_caught" : "messages.storm_stranded";

    this.UI.sendMessage(t("messages.storm"),
                        t(key, {ship: this.turn.ship.name}));
  }

  // Storms do not persist
  public async perform(persist = false, silent = false) {
    this.apply();
    this.display(silent);

    if (this.caught) {
      await new Move(this.game, this.board, this.turn, this.to).perform(false);
    }
  }
}

export { Storm };
