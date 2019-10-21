import { BoardBuilder } from "./board-builder";
import { GameBuilder } from "./game-builder";

import { CanvasAdapter } from './canvas-adapter';

import { features } from "./data/map-features";
import { ships } from "./data/ships";

const canvasWidth = 2000;
const canvasHeight = 1384;

const canvasBG = new CanvasAdapter(document.getElementById("background") as HTMLCanvasElement);
const canvasFG = new CanvasAdapter(document.getElementById("foreground") as HTMLCanvasElement);

canvasBG.element.width = canvasWidth;
canvasBG.element.height = canvasHeight;

canvasFG.element.width = canvasWidth;
canvasFG.element.height = canvasHeight;

const galleon = document.getElementById("galleon") as CanvasImageSource;
const sailboat = document.getElementById("sailboat") as CanvasImageSource;

const board = new BoardBuilder(canvasBG, canvasFG).build(
  features,
  {width: canvasBG.element.width, height: canvasBG.element.height},
  {galleon: galleon, brigantine: sailboat});

board.drawGrid();

const gameBuilder = new GameBuilder();
const game = gameBuilder.build(board, ships);

game.start();

(window as any).game = game;
