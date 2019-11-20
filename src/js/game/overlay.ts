import { Coordinates } from "../lib/coordinates";
import { Board } from "../board";

class Overlay {
  private board: Board;

  private readonly MOVE_HIGHLIGHT_COLOR = "rgba(102, 204, 0, 0.5)";
  private readonly TARGET_HIGHLIGHT_COLOR = "rgba(255, 0, 51, 0.5)";

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

  public clear() {
    this.board.clearHighlight();
  }
}

export { Overlay };
