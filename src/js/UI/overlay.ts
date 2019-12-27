import { Coordinates } from "../lib/coordinates";
import { Board, Drawable } from "../board";
import { Area } from "../board/area";

class Overlay {
  private board: Board;

  private readonly MOVE_HIGHLIGHT_COLOR = "rgba(102, 204, 0, 0.5)";
  private readonly TARGET_HIGHLIGHT_COLOR = "rgba(255, 0, 51, 0.5)";
  private readonly SHIP_HIGHLIGHT_COLOR = "rgba(51,102,204, 0.5)";

  private readonly COVER_COLOR = "rgba(1, 1, 1, 0.1)";
  private readonly ACTIVE_AREA_PADDING = 1;

  constructor(board: Board) {
    this.board = board;
  }

  public highlightCells(cells: Coordinates[], color: string) {
    cells.forEach(cell => this.board.highlightCell(cell, color));
  }

  public highlightMoves(cells: Coordinates[]) {
    this.highlightCells(cells, this.MOVE_HIGHLIGHT_COLOR);
  }

  public highlightTargets(cells: Coordinates[]) {
    this.highlightCells(cells, this.TARGET_HIGHLIGHT_COLOR);
  }

  public highlightShip(at: Coordinates) {
    this.board.highlightShip(at, this.SHIP_HIGHLIGHT_COLOR);
  }

  public highlightWind(at: Coordinates, wind: Drawable) {
    this.board.highlightWind(at, wind);
  }

  public showActiveArea(movement: Coordinates[]) {
    const area = Area.build(
                   movement).expand(
                     this.ACTIVE_AREA_PADDING).crop(
                       this.board.isOnMap.bind(this.board));

    this.board.clearCover();
    this.board.cover(this.COVER_COLOR);
    this.board.uncoverArea(area);
    this.board.gridArea(area);
  }

  public clear() {
    this.board.clearHighlight();
    this.board.clearCover();
  }
}

export { Overlay };
