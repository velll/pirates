import { Coordinates } from "./lib/coordinates";
import { Board } from './board';
import { Turn } from './game/turn';

import { each, last, size, isEqual } from 'lodash';
import { assert } from './lib/assert';

class Game {
  public telemetry: Reportable;

  private board: Board;
  private ships: Moveable[];
  private status: string;

  private turns: Turn[];

  private readonly CADIZ: Coordinates = {x: 5, y: 21};

  constructor(board: Board, ships: Moveable[], telemetry: Reportable) {
    this.board = board;
    this.ships = ships;
    this.telemetry = telemetry;

    this.status = "created";
    this.turns = [];
  }

  public moveShip(ship: Moveable, to: Coordinates) {
    assert(ship == this.getCurrentTurn().ship, "cannot move ships out of turn");

    const from = ship.coordinates;
    assert(!(from.x == to.x && from.y == to.y), "cannot move ship to the cell it's on");

    ship.move(to);
    this.board.moveShip(ship.type, from, to);

    if (this.isGameOver()) {
      this.congratulate(ship.fleet);
    }

    this.turn();
  }

  public start() {
    this.turn();
  }

  public turn() {
    setTimeout(this.drawAllShips.bind(this), 500); // FIXME: with promises

    const shipsTotal = size(this.ships);
    const turnNo = size(this.turns);
    const ship = this.ships[turnNo % shipsTotal];

    const turn = new Turn(turnNo, ship);

    this.turns[size(this.turns)] = turn;
    this.board.highlightCells(turn.availableForMove);

    this.telemetry.report(this.getCurrentTurn());
  }

  public getCurrentTurn() {
    return last(this.turns);
  }

  public getCurrentShip() {
    return this.getCurrentTurn().ship;
  }

  public clickHandler(e: MouseEvent) {
    const coordinates = this.board.locateCell({left: e.offsetX, top: e.offsetY});

    if (this.isValidMove(coordinates)) {
      this.moveShip(this.getCurrentShip(), coordinates);
    }
  }

  private drawAllShips() {
    each(this.ships, (ship) => {
      this.board.drawShip(ship.type, ship.coordinates);
    });
  }

  private isValidMove(to: Coordinates): boolean {
    return this.getCurrentTurn().isValidMove(to);
  }

  private isGameOver(): boolean {
    const currentShip = this.getCurrentShip();

    if (!currentShip.carriesGold) {
      return false;
    }

    if (currentShip.fleet == "Spaniards") {
      if (isEqual(currentShip.coordinates, this.CADIZ)) {
        return true;
      }
    }

    if (currentShip.fleet == "Pirates") {
      if (isEqual(currentShip.coordinates, this.CADIZ)) {
        return true;
      }
    }

    return false;
  }

  private congratulate(fleet: string) {
    alert("Game Over! " + fleet + " have won");
  }
}

interface Moveable {
  coordinates: Coordinates;
  type: string;
  name: string;
  fleet: string;
  carriesGold: boolean;

  move(where: Coordinates): void;
}

interface Reportable {
  working: boolean;
  report(turn: Turn): void;
  switchOn(): void;
  switchOff(): void;
}

export { Game, Moveable, Reportable };
