import { Board } from "./board";
import { BoardBuilder } from "./boardBuilder";

const canvas: HTMLCanvasElement = document.getElementById("map") as HTMLCanvasElement;

const canvasWidth = 2000;
const canvasHeight = 1384;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

const builder = new BoardBuilder(ctx, canvasWidth, canvasHeight);
const board: Board  = builder.build();

board.drawBox(100, 100, 100, 100, "red");
board.drawGrid();
