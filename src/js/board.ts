import { GameMap } from "./board/gamemap";
import { Grid } from "./board/grid";

import { Coordinates } from './lib/coordinates';
import { Dimensions } from "./lib/dimensions";
import { Position } from './lib/position';

import { MovingImage } from "./board/moving-image";

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
  private wreckModels: ShipModelsDict;

  private readonly SHIP_MODEL_TO_CELL_RATIO = 0.8;

  private readonly PORT_MODEL_TO_CELL_RATIO = 0.8;
  private readonly PORT_FLAG_TO_CELL_RATIO = 0.5;
  private readonly PORT_FLAG_TO_CELL_OFFSET = 0.25;

  private readonly HP_BAR_WIDTH_TO_CELL_RATIO = 0.05;
  private readonly SHIP_TO_HP_BAR_OFFSET = 0.05;

  constructor(
    layers: Layers,
    map: GameMap,
    grid: Grid,
    shipModels: ShipModelsDict,
    wreckModels: ShipModelsDict) {
    this.layers = layers;
    this.map = map;
    this.grid = grid;
    this.shipModels = shipModels;
    this.wreckModels = wreckModels;
  }

  // window

  public scrollTo(coordinates: Coordinates) {
    const position = this.grid.getCellPosition(coordinates);
    window.scrollTo(position.left, position.top);
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
    const pos = this.grid.getCellPosition(coordinates);

    layer.drawSquare(pos, this.grid.cellSize, color);
  }

  public clearCell(layer: Drawable, coordinates: Coordinates) {
    layer.clearSquare(this.grid.getCellPosition(coordinates), this.grid.cellSize);
  }

  public drawPorts(flags: Record<string, CanvasImageSource>) {
    this.map.getPorts().forEach(port => {
      this.drawPort(port, flags[port.fleet]);
    });
  }

  public drawBoard() { this.drawGrid(); }

  // **********************
  // Overlay
  // **********************

  public highlightCell(coordinates: Coordinates, color: string) {
    this.drawCell(this.layers.highlight, coordinates, color);
  }

  public clearHighlight() {
    this.layers.highlight.clearAll();
  }

  // *************************
  // dynamic stuff (ships etc)
  // *************************

  public drawShip(type: string, coordinates: Coordinates, wreck = false, hitPoints: HitPoints = null) {
    const shipView = this.buildShipView(type, coordinates, wreck);

    this.layers.foreground.drawImage(shipView.model, shipView.position, shipView.size);

    if (hitPoints) {
      this.drawHPBar(shipView.position, shipView.size, hitPoints);
    }
  }

  public drawWreck(type: string, coordinates: Coordinates) {
    this.clearCell(this.layers.foreground, coordinates);
    this.drawShip(type, coordinates, true);
  }

  public moveShip(type: string, from: Coordinates, to: Coordinates) {
    this.layers.highlight.clearAll();

    const startShipView = this.buildShipView(type, from);
    const finishShipView = this.buildShipView(type, to);

    this.dragImage(startShipView.model, startShipView.size, startShipView.position, finishShipView.position);
    this.removeShip(from);
  }

  public removeShip(coordinates: Coordinates) {
    this.clearCell(this.layers.foreground, coordinates);
  }

  // *******************
  // static map features
  // *******************
  private drawFlag(coordinates: Coordinates, flag: CanvasImageSource) {
    const cellPos = this.grid.getCellPosition(coordinates);
    const flagSize = this.grid.cellSize * this.PORT_FLAG_TO_CELL_RATIO;

    const flagPos = {left: cellPos.left + flagSize,
                     top: cellPos.top - this.grid.cellSize * this.PORT_FLAG_TO_CELL_OFFSET};

    this.layers.background.drawLine(
      flagPos, {left: flagPos.left, top: flagPos.top + flagSize});
    this.layers.background.drawImage(flag, flagPos, flagSize);
  }

  private drawPort(coordinates: Coordinates, flag: CanvasImageSource) {
    const layer = this.layers.background;

    const pos = this.grid.getCellPosition(coordinates);
    layer.drawSquare(pos, this.grid.cellSize, this.grid.COLOR_CODE.port);

    const offsettedPos = this.grid.getOffsettedPosition(coordinates, this.PORT_MODEL_TO_CELL_RATIO);
    const offsettedWidth = this.grid.cellSize * this.PORT_MODEL_TO_CELL_RATIO;

    layer.drawCross(offsettedPos, offsettedWidth);
    this.drawFlag(coordinates, flag);
  }

  // *********************
  // dynamic stuff (ships)
  // *********************

  private drawHPBar(shipPosition: Position, barWidth: number, HP: HitPoints) {
    const start = {left: shipPosition.left,
                   top: shipPosition.top +
                    this.grid.cellSize * (this.SHIP_MODEL_TO_CELL_RATIO + this.SHIP_TO_HP_BAR_OFFSET)};
    const green = Math.round(barWidth * HP.current / HP.max);

    const finish = {left: start.left + barWidth, top: start.top};
    const lineWidth = this.grid.cellSize * this.HP_BAR_WIDTH_TO_CELL_RATIO;

    this.layers.foreground.drawLine(start, {left: start.left + green, top: start.top}, "green", lineWidth);
    if (HP.current != HP.max) {
      this.layers.foreground.drawLine({left: start.left + green, top: start.top}, finish, "red", lineWidth);
    }
  }

  private getShipSize() {
    return this.grid.cellSize * this.SHIP_MODEL_TO_CELL_RATIO;
  }

  private buildShipView(type: string, coordinates: Coordinates, wreck = false): ShipView {
    const position = this.grid.getOffsettedPosition(coordinates, this.SHIP_MODEL_TO_CELL_RATIO);
    const model = wreck ? this.wreckModels[type] : this.shipModels[type];

    return { model: model, position: position, size: this.getShipSize() };
  }

  private dragImage(image: CanvasImageSource, size: number, start: Position, finish: Position) {
    const animation = new MovingImage(this.layers.foreground, image, size);
    animation.run(start, finish);
  }

  // debugging shoved at the tail end of the class

  private drawGrid() {
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

  private drawCoords(pos: Position, size: number, coords: Coordinates) {
    const text = coords.x + "," + coords.y;
    const offsettedPosition = {left: pos.left + size / 3, top: pos.top + size / 3};

    this.layers.background.drawText(text, offsettedPosition);
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
  drawLine(start: Position, finish: Position, color?: string, width?: number): void;
  drawCross(pos: Position, width: number): void;
  clear(position: Position, dimensions: Dimensions): void;
  clearSquare(pos: Position, width: number): void;
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

interface HitPoints {
  max: number;
  current: number;
}

export { Board, Drawable, ShipModelsDict, Layers};
