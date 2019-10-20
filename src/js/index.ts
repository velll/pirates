import { Board } from "./board";
import { BoardBuilder } from "./board-builder";

import { Ship } from "./game/ship"
import { GameBuilder } from "./game-builder";

import { each } from 'lodash'

const canvas: HTMLCanvasElement = document.getElementById("map") as HTMLCanvasElement;

const canvasWidth = 2000;
const canvasHeight = 1384;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

const board = new BoardBuilder(ctx, canvasWidth, canvasHeight).build();

board.drawBox(100, 100, 100, 100, "red");
board.drawGrid();

const ships = [
  new Ship("galleon", "Spaniards", "Santa Clara", {x: 4, y: 22}),
  new Ship("galleon", "Spaniards", "Domingo",     {x: 4, y: 21}),
  new Ship("galleon", "Spaniards", "Idalho",      {x: 2, y: 16}),
  new Ship("brigantine", "Pirates", "Black Hawk",         {x: 6, y: 17}),
  new Ship("brigantine", "Pirates", "Fortune's galley",   {x: 10, y: 12}),
  new Ship("brigantine", "Pirates", "Gentelman Jack",     {x: 28, y: 19}),
  new Ship("brigantine", "Pirates", "HMS Indefatigable",  {x: 37, y: 1}),
  new Ship("brigantine", "Pirates", "Ominous",            {x: 31, y: 20}),
  new Ship("brigantine", "Pirates", "Bullshit squad",     {x: 13, y: 23})
]

const gameBuilder = new GameBuilder();
let game = gameBuilder.build(board, ships);
