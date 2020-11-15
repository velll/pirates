import { APIAdapter } from '../adapters/api-adapter';

class FetchGame {
  public readonly PATH = '/api/games/$id';

  constructor(private readonly api: APIAdapter) {
  }

  public processResponse(response: any) {
    return {
      id: response.id,
      golden_ship: response.golden_ship
    };
  }

  public async call(params: {id: string}) {
    const response = await this.api.get(this.PATH, params);

    return this.processResponse(response);
  }
}

export { FetchGame };
