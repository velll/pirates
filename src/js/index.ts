import { BoardBuilder } from "./boardBuilder"

var canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("map");

let canvasWidth = 2000;
let canvasHeight = 1384;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx: CanvasRenderingContext2D = canvas.getContext("2d");

let builder = new BoardBuilder(ctx, canvasWidth, canvasHeight);
