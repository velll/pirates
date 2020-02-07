import { Fleet, pirates, spaniards } from "../src/js/game/fleet";
import { Player } from "../src/js/player";
import { GameBuilder } from "../src/js/game/game-builder";
import { OfflineAdapter } from "../src/js/api/adapters/offline-adapter";

const adapter = new OfflineAdapter();
const builder = new GameBuilder(adapter)


test('can build a player using a fleet code', () => {
  const player = builder.buildPlayer('pirates');

  expect(player.canPlay(pirates)).toBe(true);
});

test('can build a player for an offline game', () => {
  const player = builder.buildPlayer('');

  expect(player.canPlay(pirates)).toBe(true);
  expect(player.canPlay(spaniards)).toBe(true);
});

test('will fail to build a player for unknown fleet', () => {
  expect( () => builder.buildPlayer('weirdos') ).toThrowError();
});

