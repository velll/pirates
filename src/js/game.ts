import { Ship } from "./game/ship"
import { Coordinates } from "./board/gamemap";
import { Board } from './board'

import { each } from 'lodash';

class Game {
  public board: Board;
  
  public ships: Moveable[];
  public status: string;

  constructor (board: Board, ships: Ship[]) {
    this.board = board;
    this.ships = ships;

    this.status = "created"
  }

  public moveShip(ship: Moveable, to: Coordinates) {
    const from = ship.coordinates;
    ship.move(to)

//    this.board.moveShip(ship.view, from, to);
  }

  public start() {
    each(this.ships, (ship) => {
      this.board.drawShip(ship.type, ship.coordinates)
    });    
  }
}

interface Moveable {
  coordinates: Coordinates;
  type: string;

  move(where: Coordinates): void;
}

export { Game, Moveable };