import { Coordinates } from "./lib/coordinates";
import { Board } from './board';

import { Turn } from './game/turn';
import { Overlay } from './game/overlay';

import { each, last, size, isEqual, filter, map } from 'lodash';
import { includes } from './lib/includes';
import { assert } from './lib/assert';
import { WindGenerator } from "./game/wind-generator";
import { Wind } from "./game/wind";
import { GameMap } from "./board/gamemap";

// Game starts with .start()
// Every turn starts with .turn()
class Game {
  public telemetry: Reportable;

  private board: Board;
  private ships: Moveable[];
  private status: string;

  private turns: Turn[];
  private overlay: Overlay;
  private windGen: WindGenerator;

  private readonly CADIZ: Coordinates = {x: 5, y: 21};
  private readonly SHOT_DAMAGE = 10;

  constructor(board: Board, ships: Moveable[], telemetry: Reportable) {
    this.board = board;
    this.ships = ships;
    this.telemetry = telemetry;

    this.status = "created";
    this.turns = [];

    this.overlay = new Overlay(board);
    this.windGen = new WindGenerator();
  }

  public moveShip(ship: Moveable, to: Coordinates) {
    const turn = this.getCurrentTurn();

    assert(ship == turn.ship, "cannot move ships out of turn");

    const from = ship.coordinates;
    assert(!(from.x == to.x && from.y == to.y), "cannot move ship to the cell it's on");

    turn.makeMove(to);
    ship.move(to);
    this.board.moveShip(ship.type, from, to);

    if (this.isGameOver()) {
      this.congratulate(ship.fleet);
    }

    // We made the move. If we also made the shot, then let's go for a next turn
    if (turn.hasShot() || this.getTargets(ship).length == 0) {
      this.nextTurn();
    } else {
      this.overlay.highlightTargets(this.getTargets(ship));
    }
  }

  public shoot(ship: Moveable, to: Coordinates) {
    const target = this.findShipByCoordinates(to);
    target.damage(this.SHOT_DAMAGE);

    // We made the shot. If we also made the move, then let's go for a next turn
    if (this.getCurrentTurn().hasMoved()) {
      this.nextTurn();
    }
  }

  public start() {
    this.nextTurn();
  }

  public nextTurn() {
    setTimeout(this.drawAllShips.bind(this), 500); // FIXME: with promises

    const turnNo = size(this.turns);
    const ship = this.ships[turnNo % size(this.ships)];

    const turn = new Turn(turnNo, ship, this.windGen.getRandomWind());
    this.turns[size(this.turns)] = turn;

    this.overlay.highlightMoves(turn.cellsForMove);
    this.overlay.highlightTargets(this.getTargets(ship));

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
    return filter(this.ships, ship => {
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
    const hostilesCoordinates = map(this.getEnemyShips(), ship => {
      return ship.coordinates;
    });

    return filter(hostilesCoordinates, coords => {
      return includes(range, coords);
    });
  }

  private getTargets(ship: Moveable) {
    return this.getHostilesInRange(ship.getShootingRange());
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
    return filter(this.ships, ship => ship.fleet == this.getEnemyFleet());
  }

  private drawAllShips() {
    each(this.ships, ship => { this.board.drawShip(ship.type, ship.coordinates); });
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

    if (!currentShip.carriesGold) { return false; }

    // To win a fleet must bring the gold to their own port
    if (this.board.isPortOf(currentShip.coordinates, currentShip.fleet)) {
      // But Spaniards need to bring it to a specific port: Cadiz
      if (currentShip.fleet == "Spaniards") {
        return (GameMap.isSameCell(currentShip.coordinates, this.CADIZ));
      // For the pirates — any port will do
      } else {
        return true;
      }
    } else {
      return false;
    }
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
  getShootingRange(): Coordinates[];
  getMovingRange(wind: Wind): Coordinates[];
}

interface Reportable {
  working: boolean;
  report(turn: Turn): void;
  switchOn(): void;
  switchOff(): void;
}

export { Game, Moveable, Reportable };
