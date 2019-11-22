import { BoardBuilder } from "./board-builder";
import { GameBuilder } from "./game-builder";

import { CanvasAdapter } from './lib/canvas/canvas-adapter';

// data and configuration
import { spaniards, pirates } from './game/fleet';
import { rocks } from "./data/rocks";
import { portsData } from "./data/ports";
import { config } from './data/config';
import { orders as shipOrders } from "./data/ships";
import { Shipyard } from "./shipyard";
import { Port } from "./board/port";

const canvasDimensions = {width: 2000, height: 1384};

const canvasBG = new CanvasAdapter(document.getElementById("background") as HTMLCanvasElement);
const canvasHL = new CanvasAdapter(document.getElementById("highlight") as HTMLCanvasElement);
const canvasSH = new CanvasAdapter(document.getElementById("ships") as HTMLCanvasElement);
const canvasFG = new CanvasAdapter(document.getElementById("foreground") as HTMLCanvasElement);

canvasBG.setElementDimensions(canvasDimensions);
canvasFG.setElementDimensions(canvasDimensions);
canvasHL.setElementDimensions(canvasDimensions);
canvasSH.setElementDimensions(canvasDimensions);

const galleon = document.getElementById("galleon") as CanvasImageSource;
const sailboat = document.getElementById("sailboat") as CanvasImageSource;

const galleonWreck = document.getElementById("galleon-wreck") as CanvasImageSource;
const sailboatWreck = document.getElementById("sailboat-wreck") as CanvasImageSource;

const goldSpanishGalleon = document.getElementById("gold-galleon-spaniards") as CanvasImageSource;
const goldPirateGalleon = document.getElementById("gold-galleon-pirates") as CanvasImageSource;
const goldSpanishGalleonWrecked = document.getElementById("gold-ship-wreck-spaniards") as CanvasImageSource;
const goldPirateGalleonWrecked = document.getElementById("gold-ship-wreck-pirates") as CanvasImageSource;

const shipyard = new Shipyard([
  {icon: galleon, type: "galleon", fleet: spaniards, wreck: false, golden: false},
  {icon: sailboat, type: "brigantine", fleet: pirates, wreck: false, golden: false},
  {icon: galleonWreck, type: "galleon", fleet: spaniards, wreck: true, golden: false},
  {icon: sailboatWreck, type: "brigantine", fleet: pirates, wreck: true, golden: false},
  {icon: goldSpanishGalleon, type: "galleon", fleet: spaniards, wreck: false, golden: true},
  {icon: goldPirateGalleon, type: "galleon", fleet: pirates, wreck: false, golden: true},
  {icon: goldSpanishGalleonWrecked, type: "galleon", fleet: spaniards, wreck: true, golden: true},
  {icon: goldPirateGalleonWrecked, type: "galleon", fleet: pirates, wreck: true, golden: true}
]);

const flags: Record<string, CanvasImageSource> = {
  pirates: document.getElementById("flag-pirates") as CanvasImageSource,
  spain: document.getElementById("flag-spaniards") as CanvasImageSource,
  netherlands: document.getElementById("flag-dutch") as CanvasImageSource,
  portugal: document.getElementById("flag-portuguese") as CanvasImageSource,
  france: document.getElementById("flag-french") as CanvasImageSource,
  britain: document.getElementById("flag-british") as CanvasImageSource
};

const anchor = document.getElementById("anchor") as CanvasImageSource;

const ports = portsData.map(row => new Port(row.coordinates, row.name, row.fleet,
                                            {anchor: anchor, flag: flags[row.nation]}));
(window as any).ports = ports;

const builder = new BoardBuilder(canvasBG, canvasHL, canvasSH, canvasFG);
const map = builder.buildMap(config.map, rocks, ports);
const grid = builder.buildGrid(map, config.grid, {width: canvasBG.element.width, height: canvasBG.element.height});
const board = builder.build(map, grid);

board.drawPorts(flags);

const ships = shipyard.buildAll(shipOrders);
const game = new GameBuilder().build(board, ships);

game.telemetry.switchOn();
// if (game.telemetry.working) { board.drawBoard(); }

canvasFG.element.addEventListener('click', game.clickHandler.bind(game));

(window as any).game = game;
(window as any).shipyard = shipyard;
game.start();
