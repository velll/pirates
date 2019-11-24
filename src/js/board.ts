import { GameMap } from "./board/gamemap";
import { Grid } from "./board/grid";

import { Coordinates } from './lib/coordinates';
import { Position } from './lib/position';

import { MovingImage } from "./lib/canvas/moving-image";
import { CanvasAdapter } from "./lib/canvas/canvas-adapter";
import { Fleet } from "./game/fleet";

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

  constructor(
    layers: Layers,
    map: GameMap,
    grid: Grid) {
    this.layers = layers;
    this.map = map;
    this.grid = grid;
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
  public isPort(cell: Coordinates) {
    return this.map.isPort(cell);
  }

  public isPortOf(cell: Coordinates, fleet: Fleet) {
    return this.map.isPortOf(cell, fleet);
  }

  public getPortsOf(fleet: Fleet) {
    return this.getPorts().filter(port => port.fleet.is(fleet));
  }

  public getPorts() {
    return this.map.getPorts();
  }

  public getRocks() {
    return this.map.getRocks();
  }

  // ***********************
  // drawing cells and ports
  // ***********************

  public drawCell(layer: CanvasAdapter, coordinates: Coordinates, color: string) {
    const pos = this.grid.getCellPosition(coordinates);

    layer.drawSquare(pos, this.grid.cellSize, color);
  }

  public clearCell(layer: CanvasAdapter, coordinates: Coordinates) {
    layer.clearSquare(this.grid.getCellPosition(coordinates), this.grid.cellSize);
  }

  public drawPorts() {
    this.map.getPorts().forEach(port => this.drawPort(port.view, port.coordinates));
  }

  public drawBoard(transparent = true, coordinates = false) {
     this.drawGrid(transparent, coordinates);
  }

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

  public drawShip(shipView: Drawable, coordinates: Coordinates) {
    shipView.draw(this.layers.ships,
                  this.grid.getCellPosition(coordinates),
                  this.grid.cellSize);
  }

  public moveShip(shipView: Moveable, from: Coordinates, to: Coordinates) {
    this.layers.foreground.clearAll();

    shipView.drawMove(this.layers.foreground,
                      this.grid.getCellPosition(from),
                      this.grid.getCellPosition(to),
                      this.grid.cellSize);

    this.clearCell(this.layers.ships, from);
  }

  public removeShip(coordinates: Coordinates) {
    this.clearCell(this.layers.ships, coordinates);
  }

  // *******************
  // static map features
  // *******************
  private drawPort(portView: Drawable, coordinates: Coordinates) {
    portView.draw(this.layers.background,
                  this.grid.getCellPosition(coordinates),
                  this.grid.cellSize);
  }

  // *********************
  // dynamic stuff (ships)
  // *********************

  private dragImage(image: CanvasImageSource, size: number, start: Position, finish: Position) {
    const animation = new MovingImage(this.layers.foreground, image, size);
    animation.run(start, finish);
  }

  // debugging shoved at the tail end of the class

  private drawGrid(transparent = true, coordinates = false) {
    const cellSize = this.grid.cellSize;
    const layer = this.layers.background;

    for (let row: number = 0; row < this.map.rows; row++) {
      for (let col: number = 0; col < this.map.columns; col++) {
        const color = transparent ? "transparent" : this.grid.getColor({x: col, y: row});

        if (!this.map.isRock({x: col, y: row})) {
          this.drawCell(layer, {x: col, y: row}, color);
        }

        if (coordinates) {
          const pos = this.grid.getCellPosition({x: col, y: row});
          this.drawCoords(pos, cellSize, {x: col, y: row});
        }
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
interface Layers {
  background: CanvasAdapter;
  ships: CanvasAdapter;
  highlight: CanvasAdapter;
  foreground: CanvasAdapter;
}

interface Drawable {
  draw(layer: CanvasAdapter, position: Position, cellSize: number): void;
  getImage?(): CanvasImageSource;
}

interface Moveable {
  drawMove(layer: CanvasAdapter, from: Position, to: Position, cellSize: number): void;
}

export { Board, ShipModelsDict, Layers, Drawable, Moveable};
