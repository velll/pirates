import { Coordinates } from "./lib/coordinates";
import { Board } from './board';

import { each } from 'lodash';
import { assert } from './lib/assert';

class Game {
  public board: Board;

  public ships: Moveable[];
  public status: string;

  constructor(board: Board, ships: Moveable[]) {
    this.board = board;
    this.ships = ships;

    this.status = "created";
  }

  public moveShip(ship: Moveable, to: Coordinates) {
    const from = ship.coordinates;

    assert(!(from.x == to.x && from.y == to.y), "cannot move ship to the cell it's on");

    ship.move(to);
    this.board.moveShip(ship.type, from, to);
  }

  public start() {
    each(this.ships, (ship) => {
      this.board.drawShip(ship.type, ship.coordinates);
    });
  }
}

interface Moveable {
  coordinates: Coordinates;
  type: string;

  move(where: Coordinates): void;
}

export { Game, Moveable };
