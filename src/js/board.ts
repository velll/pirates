import { GameMap } from "./board/gamemap";
import { Grid } from "./board/grid";
import { Painter } from "./board/painter";

import { Coordinates } from './lib/coordinates';
import { Position } from './lib/position';

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

  // A composite module responsible for painting
  private painter: Painter;

  constructor(layers: Layers, map: GameMap, grid: Grid) {
    this.layers = layers;
    this.map = map;
    this.grid = grid;

    this.painter = new Painter(this.grid);
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

  // ******************************
  // map data: ports, rocks, cells
  // ******************************
  public isPort(cell: Coordinates) { return this.map.isPort(cell); }
  public isRock(cell: Coordinates) { return this.map.isRock(cell); }

  public isPortOf(cell: Coordinates, fleet: Fleet) {
    return this.map.isPortOf(cell, fleet);
  }

  public getPortsOf(fleet: Fleet) {
    return this.getPorts().filter(port => port.fleet.is(fleet));
  }

  public getPort(cell: Coordinates) { return this.map.getPort(cell); }

  public getPorts() { return this.map.getPorts(); }
  public getRocks() { return this.map.getRocks(); }
  public isOnMap(cell: Coordinates) { return this.map.isOnMap(cell); }

  // **********************
  // grid positioning info
  // **********************

  public getCellCenter(cell: Coordinates) { return this.grid.getCellCenter(cell); }
  public getCellEnd(cell: Coordinates) { return this.grid.getCellEnd(cell); }

  // ***********************
  // drawing cells and ports
  // ***********************

  public drawCell(layer: CanvasAdapter, coordinates: Coordinates, color: string) {
    this.painter.drawCell(layer, coordinates, color);
  }

  public clearCell(layer: CanvasAdapter, coordinates: Coordinates) {
    this.painter.clearCell(layer, coordinates);
  }

  public drawPorts() {
    this.painter.drawPorts(this.layers.background, this.map.getPorts());
  }

  public drawBoard(transparent = true, coordinates = false) {
    this.painter.drawBoard(this.layers.background, this.map, transparent, coordinates);
  }

  // **********************
  // Overlay
  // **********************

  public highlightCell(coordinates: Coordinates, color: string) {
    this.painter.drawCell(this.layers.highlight, coordinates, color);
  }

  public highlightShip(coordinates: Coordinates, color: string) {
    this.painter.highlightShip(this.layers.highlight, coordinates, color);
  }

  public highlightWind(at: Coordinates, wind: Drawable) {
    this.painter.highlightWind(this.layers.highlight, at, wind);
  }

  public clearHighlight() {
    this.layers.highlight.clearAll();
  }

  // *************************
  // dynamic stuff (ships etc)
  // *************************

  public drawShip(shipView: Drawable, coordinates: Coordinates) {
    this.painter.drawShip(this.layers.ships, shipView, coordinates);
  }

  public moveShip(shipView: Moveable, from: Coordinates, to: Coordinates) {
    return this.painter.moveShip(this.layers.ships,
                                 this.layers.foreground,
                                 shipView,
                                 from,
                                 to);
  }

  public shoot(cannonballView: Moveable, from: Coordinates, to: Coordinates) {
    return this.painter.shoot(this.layers.foreground, cannonballView, from, to);
  }

  public removeShip(coordinates: Coordinates) {
    this.clearCell(this.layers.ships, coordinates);
  }
}

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
  drawMove(layer: CanvasAdapter, from: Position, to: Position, cellSize: number): Promise<boolean>;
}

export { Board, Layers, Drawable, Moveable};
