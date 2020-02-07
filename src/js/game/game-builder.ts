import { Game } from '../game';
import { Ship } from './ship';
import { Board } from '../board';
import { HTTPAdapter } from '../api/adapters/api';
import { spaniards } from './fleet';

class GameBuilder {
  constructor(private readonly api: HTTPAdapter) {}

  public build(board: Board, ships: Ship[], goldenShip: number): Game {
    this.loadGold(ships, goldenShip);
    const game = new Game(this.api, board, ships);

    return game;
  }

  private loadGold(ships: Ship[], goldenShip: number) {
    const spanishShips = ships.filter(ship => ship.fleet.is(spaniards));

    spanishShips[goldenShip].loadGold();
  }
}

export { GameBuilder };
