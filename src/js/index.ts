import { BoardBuilder } from "./board/board-builder";
import { GameBuilder } from "./game/game-builder";

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

import { t } from './data/i18n';
import { logger } from './lib/logger';

import { API } from "./api/adapters/api";
import { URLParams } from "./lib/url/params";
import { FetchGame } from "./api/game/fetch-game";

const params = new URLParams(window.location.href);
const gameId = params.get('game');
const api = API.adapter_for(gameId);

const canvasDimensions = {width: 2000, height: 1221};

const canvasBG = CanvasAdapter.getCanvas("background");
const canvasHL = CanvasAdapter.getCanvas("highlight");
const canvasSH = CanvasAdapter.getCanvas("ships");
const canvasCO = CanvasAdapter.getCanvas("cover");
const canvasFG = CanvasAdapter.getCanvas("foreground");

[canvasBG, canvasHL, canvasSH, canvasCO, canvasFG].forEach(canvas => canvas.setElementDimensions(canvasDimensions));

document.body.style.width = canvasDimensions.width.toString() + "px";

window.onload = async () => {
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

  const builder = new BoardBuilder(canvasBG, canvasHL, canvasSH, canvasCO, canvasFG);
  const map = builder.buildMap(config.map, rocks, ports);
  const grid = builder.buildGrid(map, config.grid, {width: canvasBG.element.width, height: canvasBG.element.height});
  const board = builder.build(map, grid);

  board.drawPorts();

  const ships = shipyard.buildAll(shipOrders);
  const game = await new GameBuilder(api).build(gameId, board, ships);

  const gameController = new GameController(game, board);

  canvasFG.element.addEventListener('click', gameController.click.bind(gameController));
  canvasFG.element.addEventListener('mousemove', gameController.mousemove.bind(gameController));

  (window as any).game = game;
  (window as any).shipyard = shipyard;
  gameController.prepare();
};

(window as any).t = t;
(window as any).logger = logger;


