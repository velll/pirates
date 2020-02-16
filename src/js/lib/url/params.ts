class URLParams {
  private readonly URL: URL;

  constructor(location: string) {
    this.URL = new URL(location);
  }

  public get(param: string) {
    return this.URL.searchParams.get(param);
  }

  public collect(params: string[]) {
    return params.map(param => this.get(param));
  }
}

export { URLParams };
