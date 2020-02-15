import { Game, ActionType } from "../game";
import { Fleet } from "../game/fleet";
import { Board } from "../board";
import { Coordinates } from "../lib/coordinates";
import { Ship } from "../game/ship";
import { UserInterface } from "../UI";
import { Move } from "../game/actions/move";
import { Shot } from "../game/actions/shot";
import { Storm } from "../game/actions/storm";
import { Repair } from "../game/actions/repair";

class GameController {
  private game: Game;
  private board: Board;

  private UI: UserInterface;

  constructor(game: Game, board: Board) {
    this.game = game;
    this.board = board;

    this.UI = new UserInterface(game, board,
                               {"button-next-turn": this.nextTurn.bind(this),
                                "button-repair": this.repair.bind(this),
                                "button-surrender": this.surrender.bind(this),
                                "button-help": this.showHelp.bind(this)},
                               {starter: this.start.bind(this),
                                helper: this.showHelp.bind(this)});

    this.UI.lock();
    this.game.registerUI(this.UI);
  }

  // event handlers

  public click(e: MouseEvent) {
    if (this.UI.isLocked()) { return false; }

    const turn = this.game.getCurrentTurn();
    const coordinates = this.board.locateCell({left: e.offsetX, top: e.offsetY});

    if (this.game.isValidShot(coordinates)) {
      this.shoot(coordinates);
    } else if (this.game.isValidMove(coordinates)) {
      this.move(coordinates);
    }

    if (this.game.isOver()) { this.UI.congratulate(turn.ship.fleet); }
  }

  public prepare() {
    const goldenShip = this.game.goldenShip;
    const port = this.board.getPort(goldenShip.coordinates);

    this.UI.preGameDialog.show(goldenShip.name, port.name);

    this.removeLoadingScreen();
  }

  public start() {
    this.drawShips(this.game.ships.filter(ship => (!ship.isSunk())));

    this.firstTurn();

    this.UI.unlock();
    this.UI.toggleStatusPanel();
  }

  public repair() {
    const turn = this.game.getCurrentTurn();

    if (this.game.canRepair()) {
      new Repair(this.game, this.board, turn).perform();
      this.nextTurn();
    }
  }

  public mousemove(e: MouseEvent) {
    const cell = this.board.locateCell({left: e.offsetX, top: e.offsetY});
    const position = this.board.getCellEnd(cell);

    const port = this.board.getPort(cell);
    const ship = this.game.findShipByCoordinates(cell);

    this.UI.handleMove(cell, position, port, ship);
  }

  public showHelp() {
    this.UI.helpDialog.show();
  }

  public async firstTurn() {
    const turn = await this.game.nextTurn();

    this.UI.scrollToActiveArea();

    if (turn.wind.isStorm()) {
      await new Storm(this.game, this.board, turn).perform();
    }

    this.UI.reportStatus(turn);
    this.UI.drawOverlay(turn);
  }

  public async nextTurn() {
    let turn = await this.game.endTurn();

    if (turn.ship.isSunk()) {
      this.board.removeShip(turn.ship.coordinates);
      turn = await this.game.nextTurn();
    }

    this.UI.scrollToActiveArea();

    if (turn.wind.isStorm()) {
      await new Storm(this.game, this.board, turn).perform();
    }

    if (!turn.ship.isReady()) { this.game.endTurn(); }

    this.drawShips(this.game.ships.filter(ship => (!ship.isSunk())));

    this.UI.reportStatus(turn);
    this.UI.drawOverlay(turn);
  }

  public surrender() {
    const enemy = Fleet.getEnemyFleet(this.game.getCurrentFleet());
    this.UI.congratulate(enemy);
  }

  // game actions

  private async move(to: Coordinates) {
    const turn = this.game.getCurrentTurn();

    const action = new Move(this.game,
                            this.board,
                            turn,
                            to);

    await this.UI.withLocked(() => action.perform());

    // We made the move. If we also made the shot, then let's go for a next turn
    if (turn.hasShot() || this.game.getTargets(turn.ship).length == 0) {
      this.nextTurn();
    } else {
      this.UI.drawOverlay(turn);
    }
  }

  private async shoot(at: Coordinates) {
    const turn = this.game.getCurrentTurn();
    const action = new Shot(this.game, this.board, turn, at);

    await this.UI.withLocked(() => action.perform());

    // We made the shot. If we also made the move, then let's go for a next turn
    if (turn.hasMoved()) {
       this.nextTurn();
    } else {
      this.UI.drawOverlay(turn);
    }
  }

  // UI

  private drawShips(ships: Ship[]) {
    this.board.reDrawAllShips(ships.map(ship => ({coordinates: ship.coordinates, view: ship.view})));
  }

  private removeLoadingScreen() {
    document.getElementById("loading").remove();
  }
}

export { GameController };
