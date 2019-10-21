import { BoardBuilder } from "./board-builder";
import { GameBuilder } from "./game-builder";

import { CanvasAdapter } from './canvas-adapter';

import { features } from "./data/map-features";
import { ships } from "./data/ships";

const canvasWidth = 2000;
const canvasHeight = 1384;

const canvas = new CanvasAdapter(document.getElementById("map") as HTMLCanvasElement);

canvas.element.width = canvasWidth;
canvas.element.height = canvasHeight;

const galleon = document.getElementById("galleon") as CanvasImageSource;
const sailboat = document.getElementById("sailboat") as CanvasImageSource;

const board = new BoardBuilder(canvas).build(
  features,
  {width: canvas.element.width, height: canvas.element.height},
  {galleon: galleon, brigantine: sailboat});

board.drawGrid();

const gameBuilder = new GameBuilder();
const game = gameBuilder.build(board, ships);

game.start();

(window as any).game = game;
