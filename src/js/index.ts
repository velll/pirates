import { BoardBuilder } from "./board-builder";
import { GameBuilder } from "./game-builder";

import { CanvasAdapter } from './canvas-adapter';

import { features } from "./data/map-features";
import { ships } from "./data/ships";

const canvasWidth = 2000;
const canvasHeight = 1384;

const canvasBG = new CanvasAdapter(document.getElementById("background") as HTMLCanvasElement);
const canvasHL = new CanvasAdapter(document.getElementById("highlight") as HTMLCanvasElement);
const canvasFG = new CanvasAdapter(document.getElementById("foreground") as HTMLCanvasElement);

canvasBG.element.width = canvasWidth;
canvasBG.element.height = canvasHeight;

canvasFG.element.width = canvasWidth;
canvasFG.element.height = canvasHeight;

const layers = {background: canvasBG, highlight: canvasHL, foreground: canvasFG};

const galleon = document.getElementById("galleon") as CanvasImageSource;
const sailboat = document.getElementById("sailboat") as CanvasImageSource;

const board = new BoardBuilder(canvasBG, canvasHL, canvasFG).build(
  features,
  {width: canvasBG.element.width, height: canvasBG.element.height},
  {galleon: galleon, brigantine: sailboat});

const gameBuilder = new GameBuilder();
const game = gameBuilder.build(board, ships);

game.telemetry.switchOn();

if (game.telemetry.working) {
  board.drawGrid();
}

canvasFG.element.addEventListener('click', game.clickHandler.bind(game));

game.start();
(window as any).game = game;
