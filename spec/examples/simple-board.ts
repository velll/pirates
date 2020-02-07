import { gameMap } from "./small-map";
import { grid } from "./even-grid";
import { BoardBuilder } from "../../src/js/board/board-builder";
import { CanvasAdapter } from "../../src/js/lib/canvas/canvas-adapter";
import { createCanvas } from 'canvas'

// TODO: use proper mocks
const kanvas = (createCanvas(100, 100) as unknown); 

const canvasBG = new CanvasAdapter(kanvas as HTMLCanvasElement);
const canvasHL = canvasBG;
const canvasSH = canvasBG;
const canvasCO = canvasBG;
const canvasFG = canvasBG;

const builder = new BoardBuilder(canvasBG, canvasHL, canvasSH, canvasCO, canvasFG)

const board = builder.build(gameMap, grid);

export { board }
