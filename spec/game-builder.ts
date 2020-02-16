import { pirates, spaniards } from "../src/js/game/fleet";
import { GameBuilder } from "../src/js/game/game-builder";
import { OfflineAdapter } from "../src/js/api/adapters/offline-adapter";

import 'regenerator-runtime/runtime';

const adapter = new OfflineAdapter();
const offLineBuilder = new GameBuilder(adapter, '')
const onLineBuilder = new GameBuilder(adapter, 'pirates')


test('can build a player using a fleet code', () => {
  const player = onLineBuilder.player;

  expect(player.canPlay(pirates)).toBe(true);
});

test('can build a player for an offline game', () => {
  const player = offLineBuilder.player;

  expect(player.canPlay(pirates)).toBe(true);
  expect(player.canPlay(spaniards)).toBe(true);
});

test('will fail to build a player for unknown fleet', () => {
  expect(() => new GameBuilder(adapter, 'weirdos')).toThrowError();
});

