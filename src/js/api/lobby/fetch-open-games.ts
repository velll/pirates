import { Fleet } from '../../game/fleet';
import { APIAdapter } from '../adapters/api-adapter';

class FetchOpenGames {
  private readonly PATH = '/api/games';

  constructor(private readonly api: APIAdapter) {
  }

  public processResponse(response: any[]) {
    return response.map(game => (
      {
        id: game.id,
        fleet: Fleet.find(game.host_fleet).name,
        created_at: game.created_at,
        join_as: Fleet.find(game.guest_fleet).name
      }
    ));
  }

  public async call() {
    const response = await this.api.get(this.PATH);

    return this.processResponse(response);
  }
}

export { FetchOpenGames };
