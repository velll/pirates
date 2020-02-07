import { HTTPAdapter } from "./api";
import { URLSubsts } from "../../lib/url/replace-params";
import { getRndInt } from "../../lib/rnd-int";

class OfflineAdapter implements HTTPAdapter {
  private SPANISH_SHIPS = 3;

  private GET_RESPONSES: Record<string, any> = {
    '/api/game/$id': {id: 0, golden_ship: getRndInt(this.SPANISH_SHIPS)}
  };

  private POST_RESPONSES: Record<string, any> = {};

  public async get(path: string, params: URLSubsts) {
    return this.GET_RESPONSES[path];
  }

  public async post(path: string, params: URLSubsts, body: Record<string, string> = {}) {
    return this.POST_RESPONSES[path](params, body);
  }
}

export { OfflineAdapter };
