import { BoardBuilder } from "./board-builder";
import { GameBuilder } from "./game-builder";

import { CanvasAdapter } from './canvas-adapter';

// data and configuration
import { features } from "./data/map-features";
import { ships } from "./data/ships";
import { config } from './data/config';

const canvasDimensions = {width: 2000, height: 1384};

const canvasBG = new CanvasAdapter(document.getElementById("background") as HTMLCanvasElement);
const canvasHL = new CanvasAdapter(document.getElementById("highlight") as HTMLCanvasElement);
const canvasFG = new CanvasAdapter(document.getElementById("foreground") as HTMLCanvasElement);

canvasBG.setElementDimensions(canvasDimensions);
canvasFG.setElementDimensions(canvasDimensions);
canvasHL.setElementDimensions(canvasDimensions);

const galleon = document.getElementById("galleon") as CanvasImageSource;
const sailboat = document.getElementById("sailboat") as CanvasImageSource;

const galleonWreck = document.getElementById("galleon-wreck") as CanvasImageSource;
const sailboatWreck = document.getElementById("sailboat-wreck") as CanvasImageSource;

const board = new BoardBuilder(canvasBG, canvasHL, canvasFG).build(
  features,
  {width: canvasBG.element.width, height: canvasBG.element.height},
  {galleon: galleon, brigantine: sailboat},
  {galleon: galleonWreck, brigantine: sailboatWreck},
  config.map,
  config.grid);

board.drawPorts();

const game = new GameBuilder().build(board, ships);

game.telemetry.switchOn();
// if (game.telemetry.working) { board.drawBoard(); }

canvasFG.element.addEventListener('click', game.clickHandler.bind(game));

(window as any).game = game;
game.start();
