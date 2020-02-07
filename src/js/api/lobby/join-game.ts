import { APIAdapter } from '../adapters/api-adapter';

class JoinGame {
  private readonly PATH = '/api/game/$id/player';

  constructor(private readonly api: APIAdapter) {
  }

  public processResponse(response: any) {
    return {id: response.id, guest_fleet: response.guest_fleet};
  }

  public async call(params: {id: string}) {
    const response = await this.api.post(this.PATH, {id: params.id});

    return this.processResponse(response);
  }
}

export { JoinGame };
