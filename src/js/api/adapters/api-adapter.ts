import { HTTPAdapter } from "./api";
import { replaceURLParams, URLSubsts } from "../../lib/url/replace-params";

class APIAdapter implements HTTPAdapter {
  public async get(path: string, params: URLSubsts = {}) {
    const url = replaceURLParams(path, params);

    return await fetch(url).then(response => response.json()).catch(e => {
      throw new Error(`API error fetching ${path}`);
    });
  }

  public async post(path: string, params: URLSubsts = {}, body: Record<string, string> = {}) {
    const url = replaceURLParams(path, params);

    const req = new Request(url, { method: "post", body: JSON.stringify(body) });

    return await fetch(req).then(response => response.json()).catch(e => {
      throw new Error(`API error fetching ${path}`);
    });
  }
}

export { APIAdapter };