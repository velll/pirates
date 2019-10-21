import { BoardBuilder } from "./board-builder";
import { GameBuilder } from "./game-builder";

import { features } from "./data/map-features";
import { ships } from "./data/ships";

const canvas: HTMLCanvasElement = document.getElementById("map") as HTMLCanvasElement;

const canvasWidth = 2000;
const canvasHeight = 1384;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

const galleon = document.getElementById("galleon") as CanvasImageSource;
const sailboat = document.getElementById("sailboat") as CanvasImageSource;

const board = new BoardBuilder(ctx).build(
  features,
  {width: canvas.width, height: canvas.height},
  {galleon: galleon, brigantine: sailboat});

board.drawGrid();

const gameBuilder = new GameBuilder();
const game = gameBuilder.build(board, ships);

game.start();

(window as any).game = game;
