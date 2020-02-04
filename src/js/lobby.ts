import * as ReactDOM from "react-dom";
import * as React from "react";
import { GamesTable } from "./lobby/components/games-table";
import { $ } from "dollarsigns";
import { APIAdapter } from './lib/api-adapter';
import { Fleet } from "./game/fleet";

class Lobby {
  private api: APIAdapter;
  private readonly FETCH_PATH = '/api/games';

  constructor() {
    this.api = new APIAdapter();

    const e = React.createElement;
    ReactDOM.render(e(GamesTable, {fetcher: this.fetchGames.bind(this)}), $("lobby"));
  }

  // FIXME: move outside
  public brushUpGame(game: any) {
    return {
             game_id: game.id,
             fleet: Fleet.find(game.fleet).name,
             created_at: game.created_at,
             join_as: Fleet.getEnemyFleet(Fleet.find(game.fleet)).name
           };
  }

  private async fetchGames(): Promise<LobbyGame[]> {
    const games: any[] = await this.api.get(this.FETCH_PATH);

    return games.map(game => this.brushUpGame(game));
  }
}

interface LobbyGame {
  game_id: string;
  fleet: string;
  created_at: string;
  join_as: string;
}

export { LobbyGame };

window.onload = () => {
  (window as any).lobby = new Lobby();
};
