import { GameMap } from "./board/gamemap";
import { Grid, Position } from "./board/grid";
import { Coordinates } from './lib/coordinates';
import { Dimensions } from "./lib/dimensions";
import { MovingImage } from "./board/moving-image";

class Board {
  private canvas: Drawable;
  // map and static features are rendered in background
  private background: Drawable;
  // ships and dynamic stuff is rendered in foreground
  private foreground: Drawable;
  private map: GameMap;
  private grid: Grid;
  private shipModels: ShipModelsDict;

  private readonly SHIP_MODEL_TO_CELL_RATIO = 0.95;

  constructor(
    background: Drawable,
    foreground: Drawable,
    map: GameMap,
    initialDimensions: Dimensions,
    shipModels: ShipModelsDict) {
    this.background = background;
    this.foreground = foreground;
    this.map = map;
    this.grid = new Grid (this.map, initialDimensions);
    this.shipModels = shipModels;
  }

  // *******************
  // static map features
  // *******************

  public drawCell(pos: Position, size: number, color: string) {
    this.background.drawBox(pos, {width: size, height: size}, color);
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

  // *************************
  // dynamic stuff (ships etc)
  // *************************

  public drawShip(type: string, coordinates: Coordinates) {
    const shipView = this.buildShipView(type, coordinates);

    this.foreground.drawImage(shipView.model, shipView.position, shipView.size);
  }

  public moveShip(type: string, from: Coordinates, to: Coordinates) {
    const startShipView = this.buildShipView(type, from);
    const finishShipView = this.buildShipView(type, to);

    this.dragImage(startShipView.model, startShipView.size, startShipView.position, finishShipView.position);
  }

  // *******************
  // static map features
  // *******************

  private drawCoords(pos: Position, size: number, coords: Coordinates) {
    const text = coords.x + "," + coords.y;
    const offsettedPosition = {left: pos.left + size / 3, top: pos.top + size / 3};

    this.background.drawText(text, offsettedPosition);
  }

  // *********************
  // dynamic stuff (ships)
  // *********************
  private getShipSize() {
    return this.grid.cellSize * this.SHIP_MODEL_TO_CELL_RATIO;
  }

  private buildShipView(type: string, coordinates: Coordinates): ShipView {
    const position = this.grid.getCellPosition(coordinates);
    const offset = this.grid.cellSize * (1 - this.SHIP_MODEL_TO_CELL_RATIO);
    const offsettedPosition = {left: position.left + offset, top: position.top + offset};

    return {
      model: this.shipModels[type],
      position: offsettedPosition,
      size: this.getShipSize()
    };
  }

  private dragImage(image: CanvasImageSource, size: number, start: Position, end: Position) {
    const animation = new MovingImage(this.foreground,
                                      image,
                                      size,
                                      start,
                                      end);

    animation.run();
  }
}

type ShipModelsDict = Record<string, CanvasImageSource>;

// What we expect from our canvas adapter
interface Drawable {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  drawBox(pos: Position, dimesions: Dimensions, color: string): void;
  drawImage(image: CanvasImageSource, pos: Position, size: number): void;
  drawText(text: string, pos: Position): void;
  clear(position: Position, dimensions: Dimensions): void;
}

interface ShipView {
  model: CanvasImageSource;
  position: Position;
  size: number;
}

export { Board, Drawable, ShipModelsDict };
