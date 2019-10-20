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

const board = new BoardBuilder(ctx).build(features, {width: canvas.width, height: canvas.height});

// I'll just leave it here for now as I use it to check if canvas is working at all
board.drawBox(100, 100, 100, 100, "red");
board.drawGrid();

const gameBuilder = new GameBuilder();
let game = gameBuilder.build(board, ships);
