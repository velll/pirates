import { Game } from "../game";
import { Fleet } from "../game/fleet";
import { Board } from "../board";
import { Coordinates } from "../lib/coordinates";
import { Ship } from "../game/ship";
import { Turn } from "../game/turn";
import { CannonballView } from "../views/cannonball";
import { UserInterface } from "../UI";

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

  public prepare() {
    const goldenShip = this.game.loadGold();
    const port = this.board.getPort(goldenShip.coordinates);

    this.UI.preGameDialog.show(goldenShip.name, port.name);

    this.removeLoadingOverlay();
  }

  public start() {
    this.nextTurn();

    this.UI.toggleStatusPanel();
  }

  public repair() {
    const turn = this.game.getCurrentTurn();

    if (this.game.canRepair()) {
      turn.ship.repair();
      this.UI.reportStatus(turn);
      this.nextTurn();
    }
  }

  public mousemove(e: MouseEvent) {
    const cell = this.board.locateCell({left: e.offsetX, top: e.offsetY});
    const position = this.board.getCellEnd(cell);

    const port = this.board.getPort(cell);
    const ship = this.game.findShipByCoordinates(cell);

    if (this.UI.cellTip.hasMoved(cell)) {
      if (port || ship) {
        this.UI.cellTip.render(cell, position, port, ship);
      } else if (this.UI.cellTip.isVisible()) {
        this.UI.cellTip.hide();
      }
    }
  }

  public showHelp() {
    this.UI.helpDialog.show();
  }

  // event handlers done

  public async nextTurn() {
    let turn = this.game.nextTurn();

    if (turn.ship.isSunk()) {
      this.board.removeShip(turn.ship.coordinates);
      turn = this.game.nextTurn();
    }

    this.UI.scrollToActiveArea();

    if (turn.wind.isStorm()) {
      await this.drawStorm(turn);
    }

    if (!turn.ship.isReady()) { this.game.nextTurn(); }

    this.drawShips(this.game.ships.filter(ship => (!ship.isSunk())));

    this.UI.reportStatus(turn);
    this.UI.drawOverlay(turn);
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
      this.UI.drawOverlay(turn);
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
      this.UI.drawOverlay(turn);
    }
  }

  private async drawStorm(turn: Turn) {
    if (this.game.isCaughtInStorm(turn)) {
      this.UI.sendMessage("Storm!",
                          `The ${turn.wind.getName()} wind is howling and your ship moves 1 cell`,
                          true);

      const to = turn.wind.follow(turn.ship.coordinates);
      await this.moveByStorm(turn, to);
    } else {
      this.UI.sendMessage("Storm!",
                          `The ${turn.wind.getName()} wind is howling. You cannot move this turn`,
                          true);
    }
  }

  private async moveByStorm(turn: Turn, to: Coordinates) {
    this.UI.highlightWind(turn.ship.coordinates, turn.wind);

    const from = turn.ship.coordinates;
    turn.makeMove(to);

    await this.board.moveShip(turn.ship.view, from, to);
    this.game.followStorm(turn.ship, to);

    this.board.drawShip(turn.ship.view, to);
  }

  private captureGold() {
    const goldenShip = this.game.captureGoldenShip();
    this.board.drawShip(goldenShip.view, goldenShip.coordinates);
  }

  // UI

  private drawShips(ships: Ship[]) {
    this.board.reDrawAllShips(ships.map(ship => ({coordinates: ship.coordinates, view: ship.view})));
  }

  private congratulate(fleet: Fleet) {
    this.UI.sendMessage("Game Over! ", fleet.name + " have won");
  }

  private removeLoadingOverlay() {
    document.getElementById("loading-overlay").remove();
  }
}

export { GameController };
