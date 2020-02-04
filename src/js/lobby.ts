import * as ReactDOM from "react-dom";
import * as React from "react";
import { GamesTable } from "./lobby/components/games-table";
import { $ } from "dollarsigns";
import { APIAdapter } from './lib/api-adapter';
import { Fleet } from "./game/fleet";

class Lobby {
  private api: APIAdapter;
  private readonly FETCH_PATH = '/api/games';
  private readonly NEW_GAME_PATH = '/api/games';

  constructor() {
    this.api = new APIAdapter();

    const e = React.createElement;
    ReactDOM.render(e(GamesTable,
                     {
                       fetcher: this.fetchGames.bind(this),
                       starter: this.startGame.bind(this),
                       joiner: this.join.bind(this)
                    }),
                    $("lobby"));
  }

  private async join(id: string) {
    const game = await this.api.post(`/api/game/${id}/player`);

    window.location.href = `/game.html?game=${game.id}&fleet=${game.guest_fleet}`;
  }

  // FIXME: move outside
  private brushUpGame(game: any) {
    return {
             game_id: game.id,
             fleet: Fleet.find(game.host_fleet).name,
             created_at: game.created_at,
             join_as: Fleet.find(game.guest_fleet).name
           };
  }

  private createGame(fleet: string) {
    return this.api.post(this.NEW_GAME_PATH, {fleet: fleet});
  }

  private async startGame(fleet: string) {
    const game = await this.createGame(fleet);

    window.location.href = `/game.html?game=${game.id}&fleet=${fleet}`;
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
