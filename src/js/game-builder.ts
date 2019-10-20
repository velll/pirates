import { Game } from './game'
import { Ship } from './game/ship'
import { Board } from './board'

class GameBuilder {
  
  public build(board: Board, ships: Ship[]): Game {
    const game = new Game(board, ships);
    return game;
  }
}

export { GameBuilder };
