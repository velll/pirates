import { Action, ActionType, Game } from "../../game";
import { Board } from "../../board";
import { Turn } from "../turn";

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
              public readonly turn: Turn) {
  }

  public apply() {
    throw new Error('Abstract actions cannot be applied');
  }

  public display() {
    throw new Error('Abstract actions cannot be displayed');
  }

  public async perform() {
    this.apply();
    this.turn.actions.push(this);

    // displays are often asynchronous
    await this.display();
  }

  public toJSON() {
    return {
      game_id: this.game.id,
      turn_no: this.turn.no.toString(),
      type: ActionType[this.actionType]
    };
  }
}

export { AbstractAction };
