class URLParams {
  private readonly URL: URL;

  constructor(location: string) {
    this.URL = new URL(location);
  }

  public get(param: string) {
    return this.URL.searchParams.get(param);
  }
}

export { URLParams };
