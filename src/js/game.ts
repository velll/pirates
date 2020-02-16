import { Coordinates } from "./lib/coordinates";
import { Board } from './board';

import { Turn, TurnRecord } from './game/turn';

import { last } from 'lodash';
import { includes } from './lib/includes';
import { GameMap } from "./board/gamemap";
import { Fleet, spaniards, pirates, neutrals } from "./game/fleet";
import { filterOut } from "./lib/filter-out";
import { Ship } from "./game/ship";
import { Area } from "./board/area";
import { Calendar } from "./game/calendar";
import { Wind } from "./game/wind";

import { HTTPAdapter } from "./api/adapters/api";
import { logger } from "./lib/logger";
import { UserInterface } from "./UI";
import { ActionBuilder } from "./game/actions/action-builder";
import { RemoteGame } from "./game/remote";

/*
Main class holding the game state. The only changes to the game are done
via game Actions (game/actions/).
*/

class Game {
  public id: string;
  public remote: RemoteGame;

  public board: Board;
  public ships: Ship[];
  public goldenShip: Ship;
  public UI: UserInterface;

  private turns: Turn[];
  private readonly calendar: Calendar;

  private actionBuilder: ActionBuilder;

  private readonly CADIZ: Coordinates = {x: 38, y: 8};
  private readonly START_DATE = new Date(1634, 5, 1);

  constructor(api: HTTPAdapter, id: string, board: Board, ships: Ship[]) {
    this.id = id;
    this.remote = new RemoteGame(api, id);

    this.board = board;
    this.ships = ships;

    this.calendar = new Calendar(this.START_DATE);
    this.actionBuilder = new ActionBuilder(this, board);

    this.goldenShip = ships.find(ship => ship.carriesGold);

    this.turns = [];
  }

  public registerUI(UI: UserInterface) {
    this.UI = UI;
  }

  // ask a server for a next turn

  public async refreshTurn() {
    const currentTurn = this.getCurrentTurn();
    const remoteTurn = await this.remote.fetchTurn(currentTurn.no);

    return currentTurn.update(this.buildTurn(remoteTurn, currentTurn.no));
  }

  public async nextTurn(): Promise<Turn> {
    const turnNo = this.turns.length;

    const remoteTurn = await this.remote.fetchTurn(turnNo);

    const turn = this.buildTurn(remoteTurn, turnNo);
    this.pushTurn(turn);

    if (turn.ship.isWrecked()) { turn.ship.sink(); }

    if (!turn.ship.isReady()) {
      if (turn.finished) {
        return await this.nextTurn();
      } else {
        return await this.endTurn();
      }
    }

    return turn;
  }

  // end current turn, save actions and

  public endTurn() {
    const turn = this.getCurrentTurn();
    turn.finished = true;

    logger.debug(`saving turn ${turn.no.toString()}`);
    logger.debug(turn.actions);

    this.remote.saveActions(turn.no, turn.actions);

    return this.nextTurn();
  }

  public isCaughtInStorm(turn: Turn): boolean {
    const to = turn.wind.follow(turn.ship.coordinates);

    return !(this.isInPort(turn.ship) || this.findShipByCoordinates(to));
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

  public getActiveArea(expandBy: number): Area {
    const turn = this.getCurrentTurn();
    const activeCells = [turn.ship.coordinates, ...turn.availableMoves];

    return Area.build(
             activeCells).expand(
              expandBy).crop(
                 this.board.isOnMap.bind(this.board));
  }

  public getOffLimitCells(ship: Ship): OffLimits {
    return {move: this.board.getRocks().concat(
                  this.getOccupiedCells().concat(
                  this.board.getPortsOf(
                    Fleet.getEnemyFleet(ship.fleet)).map(port => port.coordinates))),
            shot: this.board.getPorts().map(port => port.coordinates)};
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

  private buildTurn(remoteTurn: TurnRecord, no: number) {
    const ship = this.ships[remoteTurn.ship_index];

    const wind = new Wind(remoteTurn.wind_bearing, remoteTurn.wind_force);
    const mvmt = ship.getMovingRange(wind).filter(cell => this.board.isOnMap(cell));

    const date = this.calendar.add(no);

    // cannot move to already occupied cells
    // cannot shoot into ports
    const offLimitCells = this.getOffLimitCells(ship);

    const turn = new Turn(no, date, ship, wind, mvmt, offLimitCells);

    if (remoteTurn.finished) {
      turn.finished = remoteTurn.finished;
      turn.actions = this.actionBuilder.build(turn, remoteTurn.actions);
    }

    return turn;
  }

  private pushTurn(turn: Turn) {
    this.turns[this.turns.length] = turn;
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

// Unplayable cells
interface OffLimits {
  move: Coordinates[],
  shot: Coordinates[]
}

interface Reportable {
  report(turn: Turn): void;
}

interface Action {
  actionType: ActionType;

  perform(persist?: boolean): void;
  toJSON(): ActionRecord;
}

interface ActionRecord {
  type: ActionType;
  game_id: string;
  turn_no: number;
  cellx?: number;
  celly?: number;
}

enum ActionType {
  abstract = 'abstract',
  storm = 'storm',
  move = 'move',
  shot = 'shot',
  capture = 'capture',
  repair = 'repair'
}

export { Game, OffLimits, Reportable, Action, ActionRecord, ActionType };
