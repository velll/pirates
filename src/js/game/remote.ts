import { Action } from "../game";
import { HTTPAdapter } from "../api/adapters/api";
import { FetchTurn } from "../api/game/fetch-turn";
import { SaveActions } from "../api/game/save-actions";

class RemoteGame {
  constructor(private readonly api: HTTPAdapter, private readonly gameId: string) {
  }

  public async fetchTurn(turnNo: number) {
    return await new FetchTurn(this.api).call({game_id: this.gameId,
                                               turn_no: turnNo});
  }

  public async saveActions(turnNo: number, actions: Action[]) {
    new SaveActions(this.api).call(
      { game_id: this.gameId, turn_no: turnNo.toString() },
      { actions: actions }
    );

  }

}

export { RemoteGame };
