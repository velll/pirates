import { APIAdapter } from '../adapters/api-adapter';

class SaveActions {
  public readonly PATH = '/api/game/$game_id/turns/$turn_no/actions';

  constructor(private readonly api: APIAdapter) {
  }

  public async call(params: {game_id: string, turn_no: string},
                    body: {actions: string}) {
    const response = await this.api.post(this.PATH, params, JSON.stringify(body.actions));

    return {};
  }
}

export { SaveActions };
