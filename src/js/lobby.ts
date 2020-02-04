import * as ReactDOM from "react-dom";
import * as React from "react";
import { GamesTable } from "./lobby/components/games-table";
import { $ } from "dollarsigns";

// FIXME: Remove once I have the api set up
const placeHolderGames = [
  {
    game_id: "13213",
    fleet: "Pirates",
    created_at: "Feb 2 23:45",
    join_as: "Spaniards"
  },
  {
    game_id: "23434",
    fleet: "Spaniards",
    created_at: "Mar 3 23:45",
    join_as: "Pirates"
  }
];

class Lobby {
  constructor() {
    const e = React.createElement;
    ReactDOM.render(e(GamesTable, {fetcher: this.fetchGames.bind(this)}), $("lobby"));
  }

  private async fetchGames(): Promise<LobbyGame[]> {
    return new Promise<LobbyGame[]>(resolve => (
      resolve(placeHolderGames)));
  }
}

interface LobbyGame {
  game_id: string;
  fleet: string;
  created_at: string;
  join_as: string;
}

export { LobbyGame };

window.onload = () => new Lobby();
