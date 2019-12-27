import { Board, Drawable, Moveable } from "../board";
import { CanvasAdapter } from "../lib/canvas/canvas-adapter";
import { Grid } from "./grid";
import { Coordinates } from "../lib/coordinates";
import { GameMap } from "./gamemap";
import { Position } from "../lib/position";
import { Port } from "./port";

class Painter {

  constructor(private grid: Grid) {
  }

  public drawCell(layer: CanvasAdapter, coordinates: Coordinates, color: string) {
    const pos = this.grid.getCellPosition(coordinates);

    layer.drawSquare(pos, this.grid.cellSize, color);
  }

  public clearCell(layer: CanvasAdapter, coordinates: Coordinates) {
    layer.clearSquare(this.grid.getCellPosition(coordinates), this.grid.cellSize);
  }

  public drawPorts(layer: CanvasAdapter, ports: Port[]) {
    ports.forEach(port => this.drawPort(layer, port.view, port.coordinates));
  }

  public drawBoard(layer: CanvasAdapter, map: GameMap, transparent: boolean, coordinates: boolean) {
     this.drawGrid(layer, map, transparent, coordinates);
  }

  // **********************
  // Overlay
  // **********************

  public highlightShip(layer: CanvasAdapter, coordinates: Coordinates, color: string) {
    const position = this.grid.getCellCenter(coordinates);
    layer.drawBlurryCircle(position, this.grid.cellSize, color);
  }

  public highlightWind(layer: CanvasAdapter, at: Coordinates, wind: Drawable) {
    wind.draw(layer, this.grid.getCellPosition(at), this.grid.cellSize);
  }

  // *************************
  // dynamic stuff (ships etc)
  // *************************

  public drawShip(layer: CanvasAdapter, shipView: Drawable, coordinates: Coordinates) {
    shipView.draw(layer,
                  this.grid.getCellPosition(coordinates),
                  this.grid.cellSize);
  }

  public moveShip(staticLayer: CanvasAdapter,
                  dynamicLayer: CanvasAdapter,
                  shipView: Moveable,
                  from: Coordinates,
                  to: Coordinates) {
    dynamicLayer.clearAll();

    this.clearCell(staticLayer, from);

    return shipView.drawMove(dynamicLayer,
                             this.grid.getCellPosition(from),
                             this.grid.getCellPosition(to),
                             this.grid.cellSize);
  }

  public shoot(layer: CanvasAdapter, cannonballView: Moveable, from: Coordinates, to: Coordinates) {
    layer.clearAll();

    return cannonballView.drawMove(layer,
                                   this.grid.getCellPosition(from),
                                   this.grid.getCellPosition(to),
                                   this.grid.cellSize);
  }

  // *******************
  // static map features
  // *******************
  private drawPort(layer: CanvasAdapter, portView: Drawable, coordinates: Coordinates) {
    portView.draw(layer,
                  this.grid.getCellPosition(coordinates),
                  this.grid.cellSize);
  }

  // debugging shoved at the tail end of the class

  private drawGrid(layer: CanvasAdapter, map: GameMap, transparent: boolean, coordinates: boolean) {
    const cellSize = this.grid.cellSize;

    for (let row: number = 0; row < map.rows; row++) {
      for (let col: number = 0; col < map.columns; col++) {
        const color = transparent ? "transparent" : this.grid.getColor({x: col, y: row});

        if (!map.isRock({x: col, y: row})) {
          this.drawCell(layer, {x: col, y: row}, color);
        }

        if (coordinates) {
          const pos = this.grid.getCellPosition({x: col, y: row});
          this.drawCoords(layer, pos, cellSize, {x: col, y: row});
        }
      }
    }
  }

  private drawCoords(layer: CanvasAdapter, pos: Position, size: number, coords: Coordinates) {
    const text = coords.x + "," + coords.y;
    const offsettedPosition = {left: pos.left + size / 3, top: pos.top + size / 3};

    layer.drawText(text, offsettedPosition);
  }
}

export { Painter };
