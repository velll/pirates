import { GameMap } from "./board/gamemap";
import { Grid, Position } from "./board/grid";
import { Coordinates } from './abstract/coordinates';
import { Dimensions } from "./abstract/dimensions";

type ShipModelsDict = Record<string, CanvasImageSource>;

interface Drawable {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  drawBox(pos: Position, dimesions: Dimensions, color: string): void;
  drawImage(image: CanvasImageSource, pos: Position, size: number): void;
  drawText(text: string, pos: Position): void;
}

class Board {
  private canvas: Drawable;
  private map: GameMap;
  private grid: Grid;
  private shipModels: ShipModelsDict;

  private readonly SHIP_MODEL_TO_CELL_RATIO = 0.95;

  constructor(canvas: Drawable, map: GameMap, initialDimensions: Dimensions, shipModels: ShipModelsDict ) {
    this.canvas = canvas;
    this.map = map;
    this.grid = new Grid (this.map, initialDimensions);
    this.shipModels = shipModels;
  }

  public drawCell(pos: Position, size: number, color: string) {
    this.canvas.drawBox(pos, {width: size, height: size}, color);
  }

  public drawGrid() {
    const cellSize = this.grid.cellSize;

    for (let row: number = 0; row < this.map.rows; row++) {
      for (let col: number = 0; col < this.map.columns; col++) {
        const color = this.grid.getColor({x: col, y: row});
        const pos = this.grid.getCellPosition({x: col, y: row});

        this.drawCell(pos, cellSize, color);
        this.drawCoords(pos, cellSize, {x: col, y: row});
      }
    }
  }

  public drawShip(type: string, coordinates: Coordinates) {
    const shipModel = this.shipModels[type];
    const position = this.grid.getCellPosition(coordinates);
    const shipSize = this.grid.cellSize * this.SHIP_MODEL_TO_CELL_RATIO;

    this.canvas.drawImage(shipModel, position, shipSize);
  }

  private drawCoords(pos: Position, size: number, coords: Coordinates) {
    const text = coords.x + "," + coords.y;
    const offsettedPosition = {left: pos.left + size / 3, top: pos.top + size / 3};

    this.canvas.drawText(text, offsettedPosition);
  }
}

export { Board, Drawable, ShipModelsDict };
