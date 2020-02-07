import { APIAdapter } from '../adapters/api-adapter';

class CreateGame {
  private readonly PATH = '/api/games';

  constructor(private readonly api: APIAdapter) {
  }

  public processResponse(response: any) {
    return {id: response.id};
  }

  public async call(body: {fleet: string}) {
    const response = await this.api.post(this.PATH, {}, JSON.stringify(body));

    return this.processResponse(response);
  }
}

export { CreateGame };
