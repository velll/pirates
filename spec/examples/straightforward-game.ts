import { board } from "./simple-board";
import { GameBuilder } from "../../src/js/game/game-builder";
import { OfflineAdapter } from "../../src/js/api/adapters/offline-adapter";
import { ship, spanishShips } from "./elegant-ships";

const adapter = new OfflineAdapter();
const builder = new GameBuilder(adapter);

const game = builder.build('', '', board, [ship, ...spanishShips])

export { game }