import { GameMap } from "./board/gamemap";
import { Grid, Position } from "./board/grid";
import { Coordinates } from './lib/coordinates';
import { Dimensions } from "./lib/dimensions";
import { MovingImage } from "./board/moving-image";

import { each } from 'lodash';

class Board {
  // Layers are just canvases
  // map and static features are rendered in Background
  // highlighting cells for moves and shots is done on a Highlight layer
  // ships and dynamic stuff is rendered in Foreground
  private layers: Layers;

  private map: GameMap;
  private grid: Grid;
  private shipModels: ShipModelsDict;

  private readonly SHIP_MODEL_TO_CELL_RATIO = 0.95;
  private readonly HIGHLIGHT_CELL_COLOR = "rgba(0,102,204, 0.5)";

  constructor(
    layers: Layers,
    map: GameMap,
    initialDimensions: Dimensions,
    shipModels: ShipModelsDict) {
    this.layers = layers;
    this.map = map;
    this.grid = new Grid (this.map, initialDimensions);
    this.shipModels = shipModels;
  }

  // *************
  // map features
  // *************

  public drawCell(layer: Drawable, coordinates: Coordinates, color: string) {
    const pos = this.grid.getCellPosition({x: coordinates.x, y: coordinates.y});

    layer.drawSquare(pos, this.grid.cellSize, color);
  }

  public drawGrid() {
    const cellSize = this.grid.cellSize;
    const layer = this.layers.background;

    for (let row: number = 0; row < this.map.rows; row++) {
      for (let col: number = 0; col < this.map.columns; col++) {
        const color = this.grid.getColor({x: col, y: row});
        this.drawCell(layer, {x: col, y: row}, color);

        const pos = this.grid.getCellPosition({x: col, y: row});
        this.drawCoords(pos, cellSize, {x: col, y: row});
      }
    }
  }

  // *************************
  // dynamic stuff (ships etc)
  // *************************

  public drawShip(type: string, coordinates: Coordinates) {
    const shipView = this.buildShipView(type, coordinates);

    this.layers.foreground.drawImage(shipView.model, shipView.position, shipView.size);
  }

  public moveShip(type: string, from: Coordinates, to: Coordinates) {
    this.layers.highlight.clearAll();

    const startShipView = this.buildShipView(type, from);
    const finishShipView = this.buildShipView(type, to);

    this.dragImage(startShipView.model, startShipView.size, startShipView.position, finishShipView.position);
  }

  public locateCell(position: Position): Coordinates {
    return this.grid.locateCell(position);
  }

  public highlightCell(coordinates: Coordinates) {
    this.drawCell(this.layers.highlight, coordinates, this.HIGHLIGHT_CELL_COLOR);
  }

  public highlightCells(coords: Coordinates[]) {
    each(coords, (pair) => { this.highlightCell(pair); });
  }

  // *******************
  // static map features
  // *******************

  private drawCoords(pos: Position, size: number, coords: Coordinates) {
    const text = coords.x + "," + coords.y;
    const offsettedPosition = {left: pos.left + size / 3, top: pos.top + size / 3};

    this.layers.background.drawText(text, offsettedPosition);
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

  private dragImage(image: CanvasImageSource, size: number, start: Position, finish: Position) {
    const animation = new MovingImage(this.layers.foreground,
                                      image,
                                      size,
                                      start,
                                      finish);

    animation.run();
  }
}

type ShipModelsDict = Record<string, CanvasImageSource>;

// What we expect from our canvas adapter
interface Drawable {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  drawBox(pos: Position, dimesions: Dimensions, color: string): void;
  drawSquare(pos: Position, width: number, color: string): void;
  drawImage(image: CanvasImageSource, pos: Position, size: number): void;
  drawText(text: string, pos: Position): void;
  clear(position: Position, dimensions: Dimensions): void;
  clearAll(): void;
}

interface Layers {
  background: Drawable;
  highlight: Drawable;
  foreground: Drawable;
}

interface ShipView {
  model: CanvasImageSource;
  position: Position;
  size: number;
}

export { Board, Drawable, ShipModelsDict, Layers};
