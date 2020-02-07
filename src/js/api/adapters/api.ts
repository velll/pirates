import { APIAdapter } from "./api-adapter";
import { OfflineAdapter } from "./offline-adapter";
import { URLSubsts } from "../../lib/url/replace-params";

class API {
  public static adapter_for(game: string): HTTPAdapter {
    return game ? new APIAdapter() : new OfflineAdapter();
  }
}

interface HTTPAdapter {
  get(path: string, params: URLSubsts): any;
  post(path: string, params: URLSubsts, body: Record<string, string>): any;
}

export { API, HTTPAdapter };
