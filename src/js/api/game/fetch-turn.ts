import { APIAdapter } from '../adapters/api-adapter';
import { ActionRecord } from '../../game';

class FetchTurn {
  public readonly PATH = '/api/game/$game_id/turn/$turn_no';

  constructor(private readonly api: APIAdapter) {
  }

  public processResponse(response: any): FetchTurnReponse {
    return {
      game_id: response.game_id,
      turn_no: response.no,
      fleet: response.fleet,
      ship_index: response.ship_id,
      wind_bearing: response.wind_bearing,
      wind_force: response.wind_force,
      finished: response.finished,
      actions: JSON.parse(response.actions)
    };
  }

  public async call(params: {game_id: string, turn_no: number}) {
    const response = await this.api.get(this.PATH,
                                       {game_id: params.game_id,
                                        turn_no: params.turn_no.toString()});

    return this.processResponse(response);
  }
}

interface FetchTurnReponse {
  game_id: string;
  turn_no: number;
  fleet: string;
  ship_index: number;
  wind_bearing: string;
  wind_force: number;
  finished: boolean;
  actions: ActionRecord[]
}

export { FetchTurn, FetchTurnReponse };
