import * as ReactDOM from "react-dom";
import * as React from "react";
import { GamesTable } from "./lobby/components/games-table";
import { $ } from "dollarsigns";
import { APIAdapter } from './api/adapters/api-adapter';

import { FetchOpenGames } from './api/lobby/fetch-open-games';
import { CreateGame } from "./api/lobby/create-game";
import { JoinGame } from "./api/lobby/join-game";

class Lobby {
  private api: APIAdapter;

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
    const game = await new JoinGame(this.api).call({id: id});

    window.location.href = this.newGameLocation(game.id, game.guest_fleet);
  }

  private async startGame(fleet: string) {
    const game = await new CreateGame(this.api).call({fleet: fleet});

    window.location.href = this.newGameLocation(game.id, fleet);
  }

  private fetchGames(): Promise<LobbyGame[]> {
    return new FetchOpenGames(this.api).call();
  }

  private newGameLocation(id: string, fleet: string) {
    return `/game.html?game=${id}&fleet=${fleet}`;
  }
}

interface LobbyGame {
  id: string;
  fleet: string;
  created_at: string;
  join_as: string;
}

export { LobbyGame };

window.onload = () => {
  (window as any).lobby = new Lobby();
};
