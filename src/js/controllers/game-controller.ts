import { Game } from "../game";
import { Fleet } from "../game/fleet";
import { Board } from "../board";
import { Coordinates } from "../lib/coordinates";
import { Ship } from "../game/ship";
import { UserInterface } from "../UI";
import { Move } from "../game/actions/move";
import { Shot } from "../game/actions/shot";
import { Storm } from "../game/actions/storm";
import { Repair } from "../game/actions/repair";
import { Turn } from "../game/turn";
import { Player } from "../player";

class GameController {
  private board: Board;

  private UI: UserInterface;

  private readonly WAIT_AFTER_SCROLL = 500;

  constructor(private readonly game: Game, private readonly player: Player) {
    this.game = game;
    this.board = game.board;

    this.UI = new UserInterface(game, game.board, player.getFleetCode(),
                               {"button-next-turn": this.clickEndTurn.bind(this),
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

  public clickEndTurn() {
    if (this.UI.isLocked()) { return false; }

    this.endTurn();
  }

  public repair() {
    if (this.UI.isLocked()) { return false; }

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

    await this.actOutTurn(turn);
  }

  public async waitForEnemy() {
    const refreshed = await this.game.refreshTurn();

    if (refreshed.finished) {
      await this.playFinishedTurn(refreshed);
      await this.nextTurn();
    } else {
      setTimeout(this.waitForEnemy.bind(this), 5000);
    }
  }

  public async actOutTurn(turn: Turn) {
    this.drawShips(this.game.ships.filter(ship => (!ship.isSunk())));

    this.UI.reportStatus(turn);
    this.UI.drawOverlay(turn);

    this.UI.scrollToActiveArea();

    if (turn.wind.isStorm()) {
      await new Storm(this.game, this.board, turn).perform(false, turn.finished);
      this.UI.reportStatus(turn);
      this.UI.drawOverlay(turn);
    }

    if (turn.finished) {
      await this.playFinishedTurn(turn);
      await this.nextTurn();
    } else {
      if (this.player.canPlay(turn.ship.fleet)) {
        this.UI.unlock();
        this.UI.hideWaitScreen();
      } else {
        this.UI.lock();
        this.UI.showWaitScreen(turn.ship.fleet);
        await this.waitForEnemy();
      }
    }
  }

  public async nextTurn() {
    // Fetch the next turn and present it
    this.actOutTurn(await this.game.nextTurn());
  }

  public async endTurn() {
    // Save current turn, fetch the next one and present it
    this.actOutTurn(await this.game.endTurn());
  }

  public surrender() {
    const currentFleet = this.player.getFleet() || this.game.getCurrentFleet();

    const enemy = Fleet.getEnemyFleet(currentFleet);
    this.UI.congratulate(enemy);
  }

  private async playFinishedTurn(turn: Turn) {
    this.UI.showWaitScreen(turn.ship.fleet);

    await this.UI.scrollToActiveArea(this.WAIT_AFTER_SCROLL);

    for (const action of turn.actions) {
      this.UI.drawOverlay(turn);

      await action.perform(false);
    }
  }

  // game actions

  private async move(to: Coordinates) {
    const turn = this.game.getCurrentTurn();

    const action = new Move(this.game,
                            this.board,
                            turn,
                            to);

    await this.UI.withLocked(action.perform.bind(action));

    // We made the move. If we also made the shot, then let's go for a next turn
    if (turn.hasShot() || this.game.getTargets(turn.ship).length == 0) {
      this.endTurn();
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
       this.endTurn();
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
