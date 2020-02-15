import { Fleet, pirates, spaniards } from "../src/js/game/fleet";
import { ActionBuilder } from "../src/js/game/actions/action-builder";
import { GameBuilder } from "../src/js/game/game-builder";
import { OfflineAdapter } from "../src/js/api/adapters/offline-adapter";
import { game } from './examples/straightforward-game'
import { board } from './examples/simple-board'
import { turn } from "./examples/exciting-turn";
import { Move } from "../src/js/game/actions/move";
import { ActionType } from "../src/js/game";
import { Capture } from "../src/js/game/actions/capture";

const getBuilder = async () => (new ActionBuilder(await game, board))

const move = {
  game_id: "7833bfd5-7aa2-4086-82f7-82d2acaa746b",
  turn_no: 1,
  type: 'move' as ActionType,
  cellx: 9,
  celly: 18
}

const capture = {
  game_id: "7833bfd5-7aa2-4086-82f7-82d2acaa746b",
  turn_no: 1,
  type: 'capture' as ActionType
}

// public buildOne(turn: Turn, details: Record<string, string>): Action {
//   const proto = this.buildWhat(details.type);

test('can deal with an empty array', async () => {
  const actions = (await getBuilder()).build(turn, []);

  expect(actions).toEqual([]);
});


test('can build a Move from a record', async () => {
  const action = (await getBuilder()).buildOne(turn, move);

  expect(action.actionType).toEqual(ActionType.move);
  expect((action as Move).cell).toEqual({x: 9, y: 18});
});

test('can build a Capture from a record', async () => {
  const action = (await getBuilder()).buildOne(turn, capture);

  expect(action.actionType).toEqual(ActionType.capture);
  expect((action as Capture).turn.no).toEqual(turn.no);
});
