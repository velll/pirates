import { Game } from "./game";
import { Board } from "./board";
import { Overlay } from "./UI/overlay";

import { PreGameDialog } from "./UI/pre-game";
import { HelpDialog } from "./UI/help";
import { Turn } from "./game/turn";
import { Coordinates } from "./lib/coordinates";
import { Wind } from "./game/wind";

import { Port } from "./board/port";
import { Ship } from "./game/ship";
import { Position } from "./lib/position";

import * as ReactDOM from "react-dom";
import * as React from "react";

import { Message } from "./UI/components/message/message";
import { StatusPanel, Reportable } from "./UI/components/status-panel/status-panel";
import { CellTip } from "./UI/components/cell-tip/cell-tip";
import { GameOverScreen } from "./UI/components/game-over-screen/game-over-screen";

import { $ } from 'dollarsigns';
import { LockableState } from "./UI/lockable-state";

class UserInterface {
  public preGameDialog: PreGameDialog;
  public helpDialog: HelpDialog;

  private overlay: Overlay;
  private cellTip: CellTip;
  private messenger: Message;
  private panel: StatusPanel;

  private state: LockableState;

  private readonly ACTIVE_AREA_PADDING = 2;

  constructor(private readonly game: Game,
              private readonly board: Board,
              statusButtonHandlers: Record<string, Procedure>,
              preGameButtonHandlers: Record<string, Procedure>) {

    this.overlay = new Overlay(board, game);
    this.state = new LockableState();

    this.preGameDialog = new PreGameDialog(preGameButtonHandlers.starter, preGameButtonHandlers.helper);
    this.helpDialog = new HelpDialog();

    const e = React.createElement;

    this.messenger = ReactDOM.render(e(Message, {container: $('message')}), $('message'));
    this.cellTip = ReactDOM.render(e(CellTip, {container: $("cell-tip")}), $("cell-tip"));
    this.panel = ReactDOM.render(e(StatusPanel,
                                  {buttonHandlers: statusButtonHandlers}),
                                 $("status"));

    this.protectPage();
  }

  public async scrollToActiveArea(wait = 0) {
    const start = this.getActiveArea().start;

    const position = this.board.getCellPosition(start);
    window.scrollTo(position.left, position.top);

    if (wait > 0) {
      await new Promise(r => setTimeout(r, wait));
    }
  }

  public getActiveArea() {
    return this.game.getActiveArea(this.ACTIVE_AREA_PADDING);
  }

  // status panel

  public toggleStatusPanel() {
    this.panel.toggleCollapse();
  }

  public reportStatus(turn: Reportable) {
    this.panel.report(turn);
  }

  // messages

  public sendMessage(header: string, text: string, flash = false) {
    this.messenger.send(header, text, flash);
  }

  // cell tooltip
  public handleMove(cell: Coordinates, position: Position, port: Port, ship: Ship) {
    this.cellTip.update(cell, position, port, ship);
  }

  // overlay

  public highlightWind(where: Coordinates, wind: Wind) {
    if (wind.isCalm()) {
      this.overlay.highlightShip(where);
    } else {
      this.overlay.highlightWind(where, wind.view);
    }
  }

  public drawOverlay(turn: Turn) {
    this.overlay.clear();

    const area = this.getActiveArea();
    this.overlay.highlightActiveArea(area);

    if (!turn.hasMoved()) {
      this.overlay.highlightMoves(turn.availableMoves);
      this.highlightWind(turn.ship.coordinates, turn.wind);
    } else {
      this.overlay.highlightShip(turn.ship.coordinates);
    }

    this.overlay.highlightTargets(this.game.getTargets(turn.ship));
  }

  // game over screen

  public congratulate(winner: {name: string, code: string}) {
    this.revokePageProtection();
    ReactDOM.render(React.createElement(GameOverScreen, winner), $('game-over'));
  }

  // lockable state

  public lock() { this.state.lock(); }
  public unlock() { this.state.unlock(); }
  public isLocked() { return this.state.locked; }

  public async withLocked(f: () => void) {
    this.lock();
    await f();
    this.unlock();
  }

  // confirm leaving page

  private protectPage() { window.onbeforeunload = () => ( true ); }
  private revokePageProtection() { window.onbeforeunload = null; }
}

type Procedure = () => void;

export { UserInterface };
