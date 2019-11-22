import { Coordinates } from "./lib/coordinates";
import { Board } from './board';

import { Turn } from './game/turn';
import { Overlay } from './game/overlay';

import { last } from 'lodash';
import { includes } from './lib/includes';
import { assert } from './lib/assert';
import { WindGenerator } from "./game/wind-generator";
import { Wind } from "./game/wind";
import { GameMap, Port } from "./board/gamemap";
import { ShipView } from "./views/ship";
import { Fleet, spaniards, pirates, neutrals } from "./game/fleet";
import { filterOut } from "./lib/filter-out";

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

  private goldenShip: Moveable;

  private readonly CADIZ: Coordinates = {x: 37, y: 9};
  private readonly SHOT_DAMAGE = 10;

  constructor(board: Board, ships: Moveable[], telemetry: Reportable) {
    this.board = board;
    this.ships = ships;
    this.telemetry = telemetry;

    this.status = "created";
    this.turns = [];

    this.overlay = new Overlay(board);
    this.windGen = new WindGenerator();
    this.goldenShip = ships.filter(ship => (ship.carriesGold))[0];
  }

  public moveShip(ship: Moveable, to: Coordinates) {
    const turn = this.getCurrentTurn();
    assert(ship == turn.ship, "cannot move ships out of turn");

    const from = ship.coordinates;
    assert(!(from.x == to.x && from.y == to.y), "cannot move ship to the cell it's on");

    turn.makeMove(to);
    this.board.moveShip(ship.view, from, to);

    if (this.canCaptureGold()) {
      this.captureGold();
    }

    if (this.isGameOver()) { this.congratulate(ship.fleet.name); }

    if (!turn.hasShot()) {
      this.overlay.clear();
      this.overlay.highlightTargets(this.getTargets(ship));
    }

    // We made the move. If we also made the shot, then let's go for a next turn
    if (turn.hasShot() || this.getTargets(ship).length == 0) {
      this.nextTurn();
    }
  }

  public shoot(at: Coordinates) {
    const target = this.findShipByCoordinates(at);
    target.damage(this.SHOT_DAMAGE);
    this.getCurrentTurn().makeShot(at);

    this.board.drawShip(target.view, target.coordinates);

    if (this.canCaptureGold()) {
      this.captureGold();
    }

    // We made the shot. If we also made the move, then let's go for a next turn
    if (this.getCurrentTurn().hasMoved()) { this.nextTurn(); }
  }

  public start() { this.nextTurn(); }

  public nextTurn() {
    setTimeout(this.drawAllShips.bind(this), 500); // FIXME: with promises

    const turnNo = this.turns.length;
    const ship = this.ships[turnNo % this.ships.length];

    // cannot move to already occupied cells
    // cannot shoot into ports
    const offLimitCells = {move: this.getOccupiedCells().concat(
                                   this.board.getPortsOf(
                                     Fleet.getEnemyFleet(ship.fleet)).map(port => port.coordinates)),
                           shot: this.board.getPorts().map(port => port.coordinates)};

    const turn = new Turn(turnNo, ship, this.windGen.getRandomWind(), offLimitCells);
    this.turns[this.turns.length] = turn;

    if (ship.isReady()) {
      this.overlay.clear();
      this.overlay.highlightMoves(turn.cellsForMove);
      this.overlay.highlightTargets(this.getTargets(ship));

      // FIXME: Find some better idea
      // this.board.scrollTo(ship.coordinates);

      this.telemetry.report(this.getCurrentTurn());
    } else {
      if (ship.isWrecked()) {
        ship.sink();
        this.board.removeShip(ship.coordinates);
      }

      this.nextTurn();
    }
  }

  public getOccupiedCells(): Coordinates[] {
    return this.ships.filter(ship => (!ship.isSunk())).map(
      ship => (ship.coordinates)
    );
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
      this.shoot(coordinates);
    } else if (this.isValidMove(coordinates)) {
      this.moveShip(this.getCurrentShip(), coordinates);
    }
  }

  private findShipByCoordinates(coordinates: Coordinates): Moveable {
    return this.ships.filter(ship => (
      (ship.coordinates.x == coordinates.x && ship.coordinates.y == coordinates.y)
    ))[0];
  }

  private isHostileAt(coordinates: Coordinates): boolean {
    const ship = this.findShipByCoordinates(coordinates);

    if (ship == null || !ship.isReady()) { return false; }

    return ship.isHostileTo(this.getCurrentShip());
  }

  private getTargets(ship: Moveable) {
    const range = filterOut(ship.getShootingRange(), this.board.getPorts().map(port => port.coordinates));
    const hostiles = this.getReadyEnemyShips().map(el => (el.coordinates));

    return hostiles.filter(coords => includes(range, coords));
  }

  private getEnemyShips(): Moveable[] {
    return this.ships.filter(ship => (
      ship.fleet.is(Fleet.getEnemyFleet(this.getCurrentShip().fleet))
    ));
  }

  private getEnemyPorts(fleet: Fleet): Port[] {
    return this.board.getPortsOf(Fleet.getEnemyFleet(fleet));

  }

  private getReadyEnemyShips(): Moveable[] {
    return this.getEnemyShips().filter(ship => (ship.isReady()));
  }

  private drawAllShips() {
    this.ships.filter(ship => (!ship.isSunk())).forEach(ship => (
      this.board.drawShip(ship.view, ship.coordinates)
    ));
  }

  private isValidMove(to: Coordinates): boolean {
    return this.getCurrentTurn().isValidMove(to);
  }

  private isValidShot(at: Coordinates): boolean {
    return this.getCurrentTurn().isValidShot(at) &&
           this.isHostileAt(at);
  }

  private canCaptureGold(): boolean {
    return this.goldenShip.isWrecked() &&
           includes(GameMap.getCellsAround(this.getCurrentShip().coordinates),
                   this.goldenShip.coordinates);
  }

  private captureGold() {
    this.goldenShip.fleet = this.getCurrentShip().fleet;
    this.goldenShip.repair();
    this.board.drawShip(this.goldenShip.view, this.goldenShip.coordinates);
  }

  // Win conditions — check it after every move
  private isGameOver(): boolean {
    // Any fleet can win if all enemy ships are down
    if (this.getReadyEnemyShips().length == 0) {
      return true;
    }

    // To win a fleet must bring the gold to their own port
    if (this.board.isPortOf(this.goldenShip.coordinates, this.goldenShip.fleet)) {
      // But Spaniards need to bring it to a specific port: Cadiz
      if (this.goldenShip.fleet.is(spaniards)) {
        return (GameMap.isSameCell(this.goldenShip.coordinates, this.CADIZ));
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
  fleet: Fleet;
  carriesGold: boolean;
  view: ShipView;

  HP: number;
  maxHP: number;

  move(where: Coordinates): void;
  damage(dmg: number): void;
  getShootingRange(): Coordinates[];
  getMovingRange(wind: Wind): Coordinates[];
  sink(): void;
  repair(): void;
  isReady(): boolean;
  isWrecked(): boolean;
  isSunk(): boolean;
  isGolden(): boolean;
  isHostileTo(other: Moveable): boolean;
  isFriendlyTo(other: Moveable): boolean;
}

interface Reportable {
  working: boolean;
  report(turn: Turn): void;
  switchOn(): void;
  switchOff(): void;
}

interface HitPoints {
  current: number;
  max: number;
}

export { Game, Moveable, Reportable };
