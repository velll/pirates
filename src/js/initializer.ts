import { BoardBuilder } from "./board/board-builder";
import { GameBuilder } from "./game/game-builder";

import { Shipyard } from "./initalizer/shipyard";
import { Port } from "./board/port";

import { CanvasAdapter } from './lib/canvas/canvas-adapter';

// data and configuration
import { spaniards, pirates } from './game/fleet';
import { rocks } from "./data/rocks";
import { portsData } from "./data/ports";
import { config } from './data/config';
import { orders as shipOrders } from "./data/ships";
import { collectResources } from './initalizer/resources';

import { API } from "./api/adapters/api";

async function initialize(gameId: string, playerFleet: string) {
  const api = API.adapter_for(gameId);

  const canvasDimensions = {width: 2000, height: 1221};

  const canvasBG = CanvasAdapter.getCanvas("background");
  const canvasHL = CanvasAdapter.getCanvas("highlight");
  const canvasSH = CanvasAdapter.getCanvas("ships");
  const canvasCO = CanvasAdapter.getCanvas("cover");
  const canvasFG = CanvasAdapter.getCanvas("foreground");

  [canvasBG, canvasHL, canvasSH, canvasCO, canvasFG].forEach(canvas => canvas.setElementDimensions(canvasDimensions));

  document.body.style.width = canvasDimensions.width.toString() + "px";

  const resources = collectResources();
  pirates.flag = resources.flags.pirates;
  spaniards.flag = resources.flags.spain;

  const shipyard = Shipyard.build(resources);

  const ports = portsData.map(row => new Port(row.coordinates, row.name, row.fleet, row.nation,
                                              {anchor: resources.anchor, flag: resources.flags[row.nation]}));

  const builder = new BoardBuilder(canvasBG, canvasHL, canvasSH, canvasCO, canvasFG);
  const map = builder.buildMap(config.map, rocks, ports);
  const grid = builder.buildGrid(map, config.grid, {width: canvasBG.element.width, height: canvasBG.element.height});
  const board = builder.build(map, grid);

  board.drawPorts();

  const ships = shipyard.buildAll(shipOrders);

  const gameBuilder = new GameBuilder(api, playerFleet);
  const game = await gameBuilder.build(gameId, board, ships);
  const gameController = gameBuilder.buildController(game);

  canvasFG.element.addEventListener('click', gameController.click.bind(gameController));
  canvasFG.element.addEventListener('mousemove', gameController.mousemove.bind(gameController));

  (window as any).game = game;
  (window as any).shipyard = shipyard;
  gameController.prepare();

}

export { initialize };
