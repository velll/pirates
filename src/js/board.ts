import { GameMap } from "./board/gamemap";
import { Grid } from "./board/grid";

import { Coordinates } from './lib/coordinates';
import { Dimensions } from "./lib/dimensions";
import { Position } from './lib/position';

import { MovingImage } from "./board/moving-image";

import { each } from 'lodash';

class Board {
  // Layers are just canvases
  // map and static features are rendered in Background
  // highlighting cells for moves and shots is done on a Highlight layer
  // ships and dynamic stuff is rendered in Foreground
  private layers: Layers;

  // map holds data about in-game features and their in-game coordinates
  private map: GameMap;

  // grid knows where to draw them
  private grid: Grid;

  // Dictionary of images for different ship types
  private shipModels: ShipModelsDict;

  private readonly SHIP_MODEL_TO_CELL_RATIO = 0.95;

  constructor(
    layers: Layers,
    map: GameMap,
    grid: Grid,
    shipModels: ShipModelsDict) {
    this.layers = layers;
    this.map = map;
    this.grid = grid;
    this.shipModels = shipModels;
  }

  // *********************
  // Coordinate conversion
  // *********************

  public locateCell(position: Position): Coordinates {
    return this.grid.locateCell(position);
  }

  // **************
  // cells and grid
  // **************
  public isPortOf(cell: Coordinates, fleet: string) {
    return this.map.isPortOf(cell, fleet);
  }

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

  public highlightCell(coordinates: Coordinates, color: string) {
    this.drawCell(this.layers.highlight, coordinates, color);
  }

  public highlightCells(coordsList: Coordinates[], color: string) {
    each(coordsList, (pair) => { this.highlightCell(pair, color); });
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
