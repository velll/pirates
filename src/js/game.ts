import { Coordinates } from "./lib/coordinates";
import { Board } from './board';
import { Turn } from './game/turn';

import { each, last, size } from 'lodash';
import { assert } from './lib/assert';

class Game {

  private board: Board;
  private ships: Moveable[];
  private status: string;

  private turns: Turn[];

  constructor(board: Board, ships: Moveable[]) {
    this.board = board;
    this.ships = ships;

    this.status = "created";
    this.turns = [];
  }

  public moveShip(ship: Moveable, to: Coordinates) {
    assert(ship == this.getCurrentTurn().ship, "cannot move ships out of turn");

    const from = ship.coordinates;
    assert(!(from.x == to.x && from.y == to.y), "cannot move ship to the cell it's on");

    ship.move(to);
    this.board.moveShip(ship.type, from, to);

    this.turn();
  }

  public start() {
    this.turn();
  }

  public turn() {
    this.drawAllShips(); // FIXME: dont do it

    const shipsTotal = size(this.ships);
    const turnNo = size(this.turns);
    const ship = this.ships[turnNo % shipsTotal];

    this.turns[size(this.turns)] = new Turn(turnNo, ship);
  }

  public getCurrentTurn() {
    return last(this.turns);
  }

  public getCurrentShip() {
    return this.getCurrentTurn().ship;
  }

  public clickHandler(e: MouseEvent) {
    const coordinates = this.board.locateCell({left: e.offsetX, top: e.offsetY});
    this.moveShip(this.getCurrentShip(), coordinates);
  }

  private drawAllShips() {
    each(this.ships, (ship) => {
      this.board.drawShip(ship.type, ship.coordinates);
    });
  }}

interface Moveable {
  coordinates: Coordinates;
  type: string;

  move(where: Coordinates): void;
}

export { Game, Moveable };
