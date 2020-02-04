import { Action, Game, ActionType } from "../../game";
import { Board } from "../../board";
import { Turn } from "../turn";
import { t } from '../../data/i18n';
import { Coordinates } from "../../lib/coordinates";
import { Move } from "./move";
import { UserInterface } from "../../UI";
import { Ship } from "../ship";

class Storm implements Action {
  public readonly actionType = ActionType.storm;

  private readonly caught: boolean;
  private readonly ship: Ship;
  private readonly from: Coordinates;
  private readonly to: Coordinates;

  constructor(private readonly game: Game,
              private readonly board: Board,
              private readonly turn: Turn,
              private readonly UI: UserInterface) {

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

  public display() {
    const key = this.caught ? "messages.storm_caught" : "messages.storm_stranded";

    this.UI.sendMessage(t("messages.storm"),
                        t(key, {ship: this.turn.ship.name}));
  }

  public async perform() {
    this.apply();
    this.display();

    if (this.caught) {
      await new Move(this.game, this.board, this.turn, this.to).perform();
    }
  }
}

export { Storm };
