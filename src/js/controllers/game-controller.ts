import { Game } from "../game";
import { StatusPanel } from "../UI/status-panel";
import { Fleet } from "../game/fleet";
import { Board } from "../board";
import { Overlay } from "../UI/overlay";
import { Coordinates } from "../board/gamemap";
import { Ship } from "../game/ship";
import { assert } from "../lib/assert";
import { Turn } from "../game/turn";
import { CannonballView } from "../views/cannonball";

class GameController {
  private game: Game;
  private board: Board;

  private panel: StatusPanel;
  private overlay: Overlay;

  constructor(game: Game, board: Board) {
    this.game = game;
    this.board = board;

    this.panel = new StatusPanel(this.game,
                       {"button-next-turn": this.nextTurn.bind(this),
                        "button-repair": this.repair.bind(this),
                        "button-surrender": this.surrender.bind(this)});

    this.overlay = new Overlay(board);
  }

  // event handlers

  public click(e: MouseEvent) {
    const turn = this.game.getCurrentTurn();
    const coordinates = this.board.locateCell({left: e.offsetX, top: e.offsetY});

    if (this.game.isValidShot(coordinates)) {
      this.shoot(coordinates);
    } else if (this.game.isValidMove(coordinates)) {
      this.move(coordinates);
    }

    if (this.game.isOver()) { this.congratulate(turn.ship.fleet); }
  }

  public start() {
    this.nextTurn();
  }

  public repair() {
    const turn = this.game.getCurrentTurn();

    if (this.game.canRepair()) {
      turn.ship.repair();
      this.panel.report(turn);
      this.nextTurn();
    }
  }

  // event handlers done

  public nextTurn() {
    let turn = this.game.nextTurn();

    if (turn.ship.isSunk()) {
      this.board.removeShip(turn.ship.coordinates);
      turn = this.game.nextTurn();
    }

    if (!turn.ship.isReady()) { this.game.nextTurn(); }

    this.drawShips(this.game.ships.filter(ship => (!ship.isSunk())))

    // FIXME: Find some better idea
    // this.board.scrollTo(turn.ship.coordinates);

    this.panel.report(turn);
    this.drawOverlay(turn);
  }

  public surrender() {
    const enemy = Fleet.getEnemyFleet(this.game.getCurrentFleet());
    this.congratulate(enemy);
  }

  // game actions

  private async move(to: Coordinates) {
    const turn = this.game.getCurrentTurn();
    const ship = turn.ship;
    const from = ship.coordinates;

    turn.makeMove(to);

    await this.board.moveShip(ship.view, from, to);
    this.board.drawShip(ship.view, to);

    if (this.game.canCaptureGold()) { this.captureGold(); }

    // We made the move. If we also made the shot, then let's go for a next turn
    if (turn.hasShot() || this.game.getTargets(ship).length == 0) {
      this.nextTurn();
    } else {
      this.drawOverlay(turn);
    }
  }

  private async shoot(at: Coordinates) {
    const turn = this.game.getCurrentTurn();

    const target = this.game.findShipByCoordinates(at);
    target.damage();
    turn.makeShot(at);

    const cannonball = new CannonballView();

    await this.board.shoot(cannonball, turn.ship.coordinates, at);

    this.board.drawShip(target.view, target.coordinates);

    if (this.game.canCaptureGold()) { this.captureGold(); }

    // We made the shot. If we also made the move, then let's go for a next turn
    if (turn.hasMoved()) {
       this.nextTurn();
    } else {
      this.drawOverlay(turn);
    }
  }

  private captureGold() {
    const goldenShip = this.game.captureGoldenShip();
    this.board.drawShip(goldenShip.view, goldenShip.coordinates);
  }

  // UI

  private drawOverlay(turn: Turn) {
    this.overlay.clear();
    if (!turn.hasMoved()) {
      this.overlay.highlightMoves(turn.cellsForMove);
      this.overlay.highlightWind(turn.ship.coordinates, turn.wind.view);
    } else {
      this.overlay.highlightShip(turn.ship.coordinates);
    }

    this.overlay.highlightTargets(this.game.getTargets(turn.ship));
  }

  private drawShips(ships: Ship[]) {
    ships.forEach(ship => ( this.board.drawShip(ship.view, ship.coordinates)));
  }

  private congratulate(fleet: Fleet) {
    alert("Game Over! " + fleet.name + " have won");
  }
}

export { GameController };
