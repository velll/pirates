import { HTTPAdapter } from "./api";
import { URLSubsts } from "../../lib/url/replace-params";
import { getRndInt } from "../../lib/rnd-int";

import { offlineFetchTurn } from './offline/fetch-turn';

class OfflineAdapter implements HTTPAdapter {

  public GET_RESPONSES: Record<string, any> = {
    '/api/game/$id': () => ({id: 0, golden_ship: getRndInt(this.SPANISH_SHIPS)}),
    '/api/game/$game_id/turn/$turn_no': offlineFetchTurn
  };

  public POST_RESPONSES: Record<string, any> = {
    '/api/game/$game_id/turns/$turn_no/actions': () => ({})
  };

  private SPANISH_SHIPS = 3;

  public async get(path: string, params: URLSubsts) {
    return this.GET_RESPONSES[path](params);
  }

  public async post(path: string, params: URLSubsts, body: string= '{}') {
    return this.POST_RESPONSES[path](params, body);
  }
}

export { OfflineAdapter };
