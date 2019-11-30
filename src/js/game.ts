import { Coordinates } from "./lib/coordinates";
import { Board } from './board';

import { Turn } from './game/turn';

import { last } from 'lodash';
import { includes } from './lib/includes';
import { WindGenerator } from "./game/wind-generator";
import { GameMap } from "./board/gamemap";
import { Fleet, spaniards, pirates, neutrals } from "./game/fleet";
import { filterOut } from "./lib/filter-out";
import { Ship } from "./game/ship";

class Game {
  public telemetry: Reportable;

  public board: Board;
  public ships: Ship[];

  private turns: Turn[];
  private windGen: WindGenerator;

  private goldenShip: Ship;

  private readonly CADIZ: Coordinates = {x: 38, y: 8};

  constructor(board: Board, ships: Ship[], telemetry: Reportable) {
    this.board = board;
    this.ships = ships;
    this.telemetry = telemetry;

    this.turns = [];

    this.windGen = new WindGenerator();
    this.goldenShip = ships.filter(ship => (ship.carriesGold))[0];
  }

  public nextTurn(): Turn {
    const turnNo = this.turns.length;
    const ship = this.ships[turnNo % this.ships.length];

    const wind = this.windGen.getRandomWind();
    const mvmt = ship.getMovingRange(wind).filter(cell => this.board.isOnMap(cell));

    // cannot move to already occupied cells
    // cannot shoot into ports
    const offLimitCells = {move: this.board.getRocks().concat(
                                   this.getOccupiedCells().concat(
                                    this.board.getPortsOf(
                                      Fleet.getEnemyFleet(ship.fleet)).map(port => port.coordinates))),
                           shot: this.board.getPorts().map(port => port.coordinates)};

    const turn = new Turn(turnNo, ship, wind, mvmt, offLimitCells);
    this.turns[this.turns.length] = turn;

    if (ship.isSunk()) {
      return this.nextTurn();
    }

    if (ship.isWrecked()) { ship.sink(); }

    this.telemetry.report(turn);
    return turn;
  }

  // Current game state

  public getCurrentTurn() { return last(this.turns); }
  public getCurrentShip() { return this.getCurrentTurn().ship; }
  public getCurrentFleet() { return this.getCurrentShip().fleet; }

  public isTurnFinished(turn: Turn) {
    return turn.hasMoved() && (turn.hasShot() || this.getTargets(turn.ship).length == 0);
  }

  public getOccupiedCells(): Coordinates[] {
    return this.ships.filter(ship => (!ship.isSunk())).map(
      ship => ship.coordinates
    );
  }

  public findShipByCoordinates(coordinates: Coordinates): Ship {
    return this.ships.filter(ship => (
      (ship.coordinates.x == coordinates.x && ship.coordinates.y == coordinates.y)
    ))[0];
  }

  public getTargets(ship: Ship) {
    if (this.isInPort(ship)) { return []; }
    if (this.getCurrentTurn().hasShot()) { return []; }

    const range = filterOut(ship.getShootingRange(), this.board.getPorts().map(port => port.coordinates));
    const hostiles = this.getReadyEnemyShips().map(el => (el.coordinates));

    return hostiles.filter(coords => includes(range, coords));
  }

  public isValidMove(to: Coordinates): boolean {
    return this.getCurrentTurn().isValidMove(to);
  }

  public isValidShot(at: Coordinates): boolean {
    const ship = this.getCurrentShip();
    return includes(this.getTargets(ship), at);
  }

  public canCaptureGold(): boolean {
    return this.goldenShip.isWrecked() &&
           includes(GameMap.getCellsAround(this.getCurrentShip().coordinates),
                   this.goldenShip.coordinates);
  }

  public canRepair() {
    return (this.isInPort(this.getCurrentShip()) && !this.getCurrentTurn().hasMoved());
  }

  public captureGoldenShip(): Ship {
    this.goldenShip.surrender(this.getCurrentFleet());
    return this.goldenShip;
  }

  // Win conditions — check it after every move
  public isOver(): boolean {
    // Any fleet can win if all enemy ships are down
    if (this.getReadyEnemyShips().length == 0) { return true; }

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

  private getEnemyFleet(): Fleet {
    return Fleet.getEnemyFleet(this.getCurrentShip().fleet);
  }

  private getEnemyShips(): Ship[] {
    return this.ships.filter(ship => ship.fleet.is(this.getEnemyFleet()));
  }

  private getReadyEnemyShips(): Ship[] {
    return this.getEnemyShips().filter(ship => (ship.isReady()));
  }

  private isInPort(ship: Ship) {
    return this.board.isPort(ship.coordinates);
  }
}

interface Reportable {
  report(turn: Turn): void;
}

export { Game, Reportable };
