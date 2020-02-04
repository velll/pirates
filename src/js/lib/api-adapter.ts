class APIAdapter {
  public async get(path: string) {
    return await fetch(path).then(response => response.json()).catch(e => {
      throw new Error(`API error fetching ${path}`);
    });
  }

  public async post(path: string, body: Record<string, string> = {}) {
    const req = new Request(path, { method: "post", body: JSON.stringify(body) });

    return await fetch(req).then(response => response.json()).catch(e => {
      throw new Error(`API error fetching ${path}`);
    });
  }
}

export { APIAdapter };
