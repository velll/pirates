import { Game } from './game';
import { Ship } from './game/ship';
import { Board } from './board';
import { Telemetry } from './game/telemetry';

class GameBuilder {

  public build(board: Board, ships: Ship[]): Game {
    const telemetry = new Telemetry();
    const game = new Game(board, ships, telemetry);
    return game;
  }
}

export { GameBuilder };
