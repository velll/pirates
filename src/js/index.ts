import { BoardBuilder } from "./board-builder";
import { GameBuilder } from "./game-builder";

import { Shipyard } from "./shipyard";
import { Port } from "./board/port";

import { CanvasAdapter } from './lib/canvas/canvas-adapter';

// data and configuration
import { spaniards, pirates } from './game/fleet';
import { rocks } from "./data/rocks";
import { portsData } from "./data/ports";
import { config } from './data/config';
import { orders as shipOrders } from "./data/ships";
import { collectResources } from './resources';

import { GameController } from "./controllers/game-controller";

const canvasDimensions = {width: 2000, height: 1221};

const canvasBG = CanvasAdapter.getCanvas("background");
const canvasHL = CanvasAdapter.getCanvas("highlight");
const canvasSH = CanvasAdapter.getCanvas("ships");
const canvasFG = CanvasAdapter.getCanvas("foreground");

[canvasBG, canvasHL, canvasSH, canvasFG].forEach(canvas => canvas.setElementDimensions(canvasDimensions));

document.body.style.width = canvasDimensions.width.toString() + "px";

window.onload = () => {
  const resources = collectResources();
  pirates.flag = resources.flags.pirates;
  spaniards.flag = resources.flags.spain;

  const shipyard = new Shipyard([
    {icon: resources.ships.galleon,            type: "galleon",    fleet: spaniards, wreck: false, golden: false},
    {icon: resources.ships.sailboat,           type: "brigantine", fleet: pirates,   wreck: false, golden: false},
    {icon: resources.ships.galleonWreck,       type: "galleon",    fleet: spaniards, wreck: true,  golden: false},
    {icon: resources.ships.sailboatWreck,      type: "brigantine", fleet: pirates,   wreck: true,  golden: false},
    {icon: resources.ships.goldSpanishGalleon, type: "galleon",    fleet: spaniards, wreck: false, golden: true},
    {icon: resources.ships.goldPirateGalleon,  type: "galleon",    fleet: pirates,   wreck: false, golden: true},
    {icon: resources.ships.goldSpanishGalleonWrecked,
                                               type: "galleon",    fleet: spaniards, wreck: true,  golden: true},
    {icon: resources.ships.goldPirateGalleonWrecked,
                                               type: "galleon",    fleet: pirates,   wreck: true,  golden: true}
  ]);

  const ports = portsData.map(row => new Port(row.coordinates, row.name, row.fleet, row.nation,
                                              {anchor: resources.anchor, flag: resources.flags[row.nation]}));

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

  const gameController = new GameController(game, board);

  canvasFG.element.addEventListener('click', gameController.click.bind(gameController));
  canvasFG.element.addEventListener('mousemove', gameController.mousemove.bind(gameController));

  (window as any).game = game;
  (window as any).shipyard = shipyard;
  gameController.start();
};
