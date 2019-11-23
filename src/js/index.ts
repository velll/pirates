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
import { collectResources } from './resources';

const canvasDimensions = {width: 2000, height: 1221};

const canvasBG = new CanvasAdapter(document.getElementById("background") as HTMLCanvasElement);
const canvasHL = new CanvasAdapter(document.getElementById("highlight") as HTMLCanvasElement);
const canvasSH = new CanvasAdapter(document.getElementById("ships") as HTMLCanvasElement);
const canvasFG = new CanvasAdapter(document.getElementById("foreground") as HTMLCanvasElement);

canvasBG.setElementDimensions(canvasDimensions);
canvasFG.setElementDimensions(canvasDimensions);
canvasHL.setElementDimensions(canvasDimensions);
canvasSH.setElementDimensions(canvasDimensions);

document.body.style.width = canvasDimensions.width.toString() + "px";

const resources = collectResources();

const shipyard = new Shipyard([
  {icon: resources.ships.galleon, type: "galleon", fleet: spaniards, wreck: false, golden: false},
  {icon: resources.ships.sailboat, type: "brigantine", fleet: pirates, wreck: false, golden: false},
  {icon: resources.ships.galleonWreck, type: "galleon", fleet: spaniards, wreck: true, golden: false},
  {icon: resources.ships.sailboatWreck, type: "brigantine", fleet: pirates, wreck: true, golden: false},
  {icon: resources.ships.goldSpanishGalleon, type: "galleon", fleet: spaniards, wreck: false, golden: true},
  {icon: resources.ships.goldPirateGalleon, type: "galleon", fleet: pirates, wreck: false, golden: true},
  {icon: resources.ships.goldSpanishGalleonWrecked, type: "galleon", fleet: spaniards, wreck: true, golden: true},
  {icon: resources.ships.goldPirateGalleonWrecked, type: "galleon", fleet: pirates, wreck: true, golden: true}
]);

const ports = portsData.map(row => new Port(row.coordinates, row.name, row.fleet,
                                            {anchor: resources.anchor, flag: resources.flags[row.nation]}));

(window as any).ports = ports;

const builder = new BoardBuilder(canvasBG, canvasHL, canvasSH, canvasFG);
const map = builder.buildMap(config.map, rocks, ports);
const grid = builder.buildGrid(map, config.grid, {width: canvasBG.element.width, height: canvasBG.element.height});
const board = builder.build(map, grid);

board.drawPorts();

const ships = shipyard.buildAll(shipOrders);
const game = new GameBuilder().build(board, ships);

// game.telemetry.switchOn();
// board.drawBoard();
// if (game.telemetry.working) { board.drawBoard(false, true); }

canvasFG.element.addEventListener('click', game.clickHandler.bind(game));

(window as any).game = game;
(window as any).shipyard = shipyard;
game.start();
