import { Coordinates } from "./board/gamemap";
import { Board } from './board'

class Game {
  public board: Board;
  
  public ships: Moveable[];
  public status: string;

  constructor (board: Board, ships: Moveable[]) {
    this.board = board;
    this.ships = ships;

    this.status = "created"
  }

  public moveShip(ship: Moveable, to: Coordinates) {
    const from = ship.coordinates;
    ship.move(to)

    // FIXME: move the image on a board
  }
}

interface Moveable {
  coordinates: Coordinates;

  move(where: Coordinates): void;
}


export { Game, Moveable };