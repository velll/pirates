import { Action, ActionType, Game } from "../../game";
import { Board } from "../../board";
import { Turn } from "../turn";
import { Coordinates } from "../../lib/coordinates";

/*
The game state is only to be changed via actions. Actions
must implement apply() and display();
- apply() changes the Game state
- display() shows the changes on board/UI
*/

class AbstractAction implements Action {
  public actionType = ActionType.abstract;

  constructor(public readonly game: Game,
              public readonly board: Board,
              public readonly turn: Turn,
              public readonly cell?: Coordinates) {
  }

  public apply() {
    throw new Error('Abstract actions cannot be applied');
  }

  public display() {
    throw new Error('Abstract actions cannot be displayed');
  }

  public persist() {
    this.turn.actions.push(this);
  }

  public async perform(persist = true) {
    this.apply();
    if (persist) { this.persist(); }

    // displays are often asynchronous
    await this.display();
  }

  public toJSON() {
    return {
      game_id: this.game.id,
      turn_no: this.turn.no,
      type: ActionType[this.actionType],
      cellx: this.cell && this.cell.x,
      celly: this.cell && this.cell.y
    };
  }
}

export { AbstractAction };
