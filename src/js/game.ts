import { Coordinates } from "./lib/coordinates";
import { Board } from './board';

import { Turn } from './game/turn';
import { Overlay } from './game/overlay';

import { each, last, size, isEqual, filter, map } from 'lodash';
import { includes } from './lib/includes';
import { assert } from './lib/assert';

// Game starts with .start()
// Every turn starts with .turn()
class Game {
  public telemetry: Reportable;

  private board: Board;
  private ships: Moveable[];
  private status: string;

  private turns: Turn[];
  private overlay: Overlay;

  private readonly CADIZ: Coordinates = {x: 5, y: 21};
  private readonly SHOT_DAMAGE = 10;

  constructor(board: Board, ships: Moveable[], telemetry: Reportable) {
    this.board = board;
    this.ships = ships;
    this.telemetry = telemetry;

    this.status = "created";
    this.turns = [];

    this.overlay = new Overlay(board);
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

  public shoot(ship: Moveable, to: Coordinates) {
    const target = this.findShipByCoordinates(to);
    target.damage(this.SHOT_DAMAGE);

    this.telemetry.report(this.getCurrentTurn());
  }

  public start() {
    this.turn();
  }

  public turn() {
    setTimeout(this.drawAllShips.bind(this), 500); // FIXME: with promises

    const turnNo = size(this.turns);
    const ship = this.ships[turnNo % size(this.ships)];

    const turn = new Turn(turnNo, ship);
    this.turns[size(this.turns)] = turn;

    this.overlay.highlightMoves(turn.getCellsForMove());
    this.overlay.highlightTargets(this.getHostilesInRange(turn.getCellsForShot()));

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

    if (this.isValidShot(coordinates)) {
      this.shoot(this.getCurrentShip(), coordinates);
    } else if (this.isValidMove(coordinates)) {
      this.moveShip(this.getCurrentShip(), coordinates);
    }
  }

  private findShipByCoordinates(coordinates: Coordinates): Moveable {
    return filter(this.ships, (ship) => {
      return (ship.coordinates.x == coordinates.x && ship.coordinates.y == coordinates.y);
    })[0];
  }

  private isFriendly(ship: Moveable): boolean {
    return this.getCurrentShip().fleet == ship.fleet;
  }

  private isHostile(ship: Moveable): boolean {
    return !this.isFriendly(ship);
  }

  private isHostileAtCoordinates(coordinates: Coordinates): boolean {
    const ship = this.findShipByCoordinates(coordinates);

    if (ship == null) { return false; }

    return this.isHostile(ship);
  }

  private getHostilesInRange(range: Coordinates[]) {
    const hostilesCoordinates = map(this.getEnemyShips(), (ship) => {
      return ship.coordinates;
    });

    return filter(hostilesCoordinates, (coords) => {
      return includes(range, coords);
    });
  }

  private getEnemyFleet(): string {
    if (this.getCurrentShip().fleet == "Spaniards") {
      return "Pirates";
    } else if (this.getCurrentShip().fleet == "Pirates") {
      return "Spaniards";
    } else {
      throw Error("Unknown fleet " + this.getCurrentShip().fleet);
    }
  }

  private getEnemyShips(): Moveable[] {
    return filter(this.ships, (ship) => ship.fleet == this.getEnemyFleet());
  }

  private drawAllShips() {
    each(this.ships, (ship) => { this.board.drawShip(ship.type, ship.coordinates); });
  }

  private isValidMove(to: Coordinates): boolean {
    return this.getCurrentTurn().isValidMove(to);
  }

  private isValidShot(at: Coordinates): boolean {
    return this.getCurrentTurn().isValidShot(at) && this.isHostileAtCoordinates(at);
  }

  // Win conditions — check it after every move
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
      // FIXME: win condition for pirates is different
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

  HP: number;
  maxHP: number;

  move(where: Coordinates): void;
  damage(dmg: number): void;
}

interface Reportable {
  working: boolean;
  report(turn: Turn): void;
  switchOn(): void;
  switchOff(): void;
}

export { Game, Moveable, Reportable };
