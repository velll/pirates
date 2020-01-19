import { Game } from "./game";
import { Board } from "./board";
import { StatusPanel, Reportable } from "./UI/status-panel";
import { Overlay } from "./UI/overlay";
import { Messenger } from "./UI/messenger";
import { CellTip } from "./UI/cell-tip";
import { PreGameDialog } from "./UI/pre-game";
import { HelpDialog } from "./UI/help";
import { Turn } from "./game/turn";
import { Coordinates } from "./lib/coordinates";
import { Wind } from "./game/wind";

class UserInterface {

  public overlay: Overlay;
  public messenger: Messenger;
  public cellTip: CellTip;
  public preGameDialog: PreGameDialog;
  public helpDialog: HelpDialog;

  private panel: StatusPanel;

  private readonly ACTIVE_AREA_PADDING = 2;

  constructor(private readonly game: Game,
              private readonly board: Board,
              statusButtonHandlers: Record<string, Procedure>,
              preGameButtonHandlers: Record<string, Procedure>) {

    this.panel = new StatusPanel(game, statusButtonHandlers);
    this.overlay = new Overlay(board, game);
    this.cellTip = new CellTip();
    this.messenger = new Messenger();
    this.preGameDialog = new PreGameDialog(preGameButtonHandlers.starter, preGameButtonHandlers.helper);
    this.helpDialog = new HelpDialog();
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