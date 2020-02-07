import { APIAdapter } from '../adapters/api-adapter';

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
      wind_force: response.wind_force
    };
  }

  public async call(params: {game_id: string, turn_no: string}) {
    const response = await this.api.get(this.PATH, params);

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
}

export { FetchTurn };
