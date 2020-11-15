import { APIAdapter } from '../adapters/api-adapter';
import { Action } from '../../game';

class SaveActions {
  public readonly PATH = '/api/games/$game_id/turns/$turn_no/actions';

  constructor(private readonly api: APIAdapter) {
  }

  public async call(params: {game_id: string, turn_no: string},
                    body: {actions: Action[]}) {

    const response = await this.api.post(this.PATH, params, JSON.stringify(body.actions));

    return {};
  }
}

export { SaveActions };
