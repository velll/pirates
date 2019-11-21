import { BoardBuilder } from "./board-builder";
import { GameBuilder } from "./game-builder";

import { CanvasAdapter } from './canvas-adapter';

// data and configuration
import { features } from "./data/map-features";
import { ships } from "./data/ships";
import { config } from './data/config';
import { Shipyard } from "./shipyard";

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

const goldSpanishGalleon = document.getElementById("gold-galleon-spaniards") as CanvasImageSource;
const goldPirateGalleon = document.getElementById("gold-galleon-pirates") as CanvasImageSource;
const goldSpanishGalleonWrecked = document.getElementById("gold-ship-wreck-spaniards") as CanvasImageSource;
const goldPirateGalleonWrecked = document.getElementById("gold-ship-wreck-pirates") as CanvasImageSource;

const shipyard = new Shipyard([
  {model: galleon, type: "galleon", fleet: "Spaniards", wreck: false, golden: false},
  {model: sailboat, type: "brigantine", fleet: "Pirates", wreck: false, golden: false},
  {model: galleonWreck, type: "galleon", fleet: "Spaniards", wreck: true, golden: false},
  {model: sailboatWreck, type: "brigantine", fleet: "Pirates", wreck: true, golden: false},

  {model: goldSpanishGalleon, type: "galleon", fleet: "Spaniards", wreck: false, golden: true},
  {model: goldPirateGalleon, type: "galleon", fleet: "Pirates", wreck: false, golden: true},
  {model: goldSpanishGalleonWrecked, type: "galleon", fleet: "Spaniards", wreck: true, golden: true},
  {model: goldPirateGalleonWrecked, type: "galleon", fleet: "Pirates", wreck: true, golden: true}
]);

const flags: Record<string, CanvasImageSource> = {
  Pirates: document.getElementById("flag-pirates") as CanvasImageSource,
  Spaniards: document.getElementById("flag-spaniards") as CanvasImageSource,
  Dutch: document.getElementById("flag-dutch") as CanvasImageSource,
  Portuguese: document.getElementById("flag-portuguese") as CanvasImageSource,
  French: document.getElementById("flag-french") as CanvasImageSource,
  British: document.getElementById("flag-british") as CanvasImageSource
};

const board = new BoardBuilder(canvasBG, canvasHL, canvasFG).build(
  features,
  {width: canvasBG.element.width, height: canvasBG.element.height},
  shipyard,
  config.map,
  config.grid);

board.drawPorts(flags);

const game = new GameBuilder().build(board, ships);

game.telemetry.switchOn();
// if (game.telemetry.working) { board.drawBoard(); }

canvasFG.element.addEventListener('click', game.clickHandler.bind(game));

(window as any).game = game;
(window as any).shipyard = shipyard;
game.start();
