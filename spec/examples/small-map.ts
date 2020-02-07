import { MapConfig, Port, GameMap } from "../../src/js/board/gamemap";
import { Coordinates } from "../../src/js/lib/coordinates";
import { neutrals } from "../../src/js/game/fleet";

const rocks: Coordinates[] = [ {x: 1, y: 1} ]

let img: CanvasImageSource;

const ports: Port[] = [ 
    new Port({x: 5, y: 10}, "Plymouth", neutrals, "Britain", {anchor: img, flag: img}),
    new Port({x: 20, y: 15}, "New York", neutrals, "USA", {anchor: img, flag: img}) 
]

const mapConfig: MapConfig = {
  rows: 10,
  columns: 10
};

const gameMap = new GameMap(mapConfig, rocks, ports);


export { rocks, ports, mapConfig, gameMap }