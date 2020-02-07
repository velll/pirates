import { Game } from '../game';
import { Ship } from './ship';
import { Board } from '../board';
import { HTTPAdapter } from '../api/adapters/api';
import { spaniards } from './fleet';
import { FetchGame } from '../api/game/fetch-game';

class GameBuilder {
  constructor(private readonly api: HTTPAdapter) {}

  public async build(id: string, board: Board, ships: Ship[]): Promise<Game> {
    const remoteGame = await new FetchGame(this.api).call({id: id});
    this.loadGold(ships, remoteGame.golden_ship);

    return new Game(this.api, id, board, ships);
  }

  private loadGold(ships: Ship[], goldenShip: number) {
    const spanishShips = ships.filter(ship => ship.fleet.is(spaniards));

    spanishShips[goldenShip].loadGold();
  }
}

export { GameBuilder };
