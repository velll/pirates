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

import { $ } from 'dollarsigns';

class UserInterface {

  public overlay: Overlay;
  public messenger: Message;
  public cellTip: CellTip;
  public preGameDialog: PreGameDialog;
  public helpDialog: HelpDialog;

  private panel: StatusPanel;

  private readonly ACTIVE_AREA_PADDING = 2;

  constructor(private readonly game: Game,
              private readonly board: Board,
              statusButtonHandlers: Record<string, Procedure>,
              preGameButtonHandlers: Record<string, Procedure>) {

    this.overlay = new Overlay(board, game);

    this.preGameDialog = new PreGameDialog(preGameButtonHandlers.starter, preGameButtonHandlers.helper);
    this.helpDialog = new HelpDialog();

    const e = React.createElement;

    this.messenger = ReactDOM.render(e(Message, {container: $('message')}), $('message'));
    this.cellTip = ReactDOM.render(e(CellTip, {container: $("cell-tip")}), $("cell-tip"));
    this.panel = ReactDOM.render(e(StatusPanel,
                                  {buttonHandlers: statusButtonHandlers}),
                                 $("status"));

  }

  public scrollToActiveArea() {
    const start = this.getActiveArea().start;

    const position = this.board.getCellPosition(start);
    window.scrollTo(position.left, position.top);
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
}

type Procedure = () => void;

export { UserInterface };
