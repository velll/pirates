// Replaces params in URL as following:
// games/$id/turns/$no with {id: 1, no: 15} becomes
// games/1/turns/15

import { replaceURLParams } from '../src/js/lib/url/replace-params';


test('works with empty parameter set', () => {
  expect(replaceURLParams('/player/$id', {})).toEqual('/player/$id')
});

test('can replace one parameter', () => {
  expect(replaceURLParams('/player/$id', {id: '10'})).toEqual('/player/10')
});

test('can replace multiple parameters', () => {
  expect(replaceURLParams('/game/$game/player/$player', {game: 'pool', player: 'john'})).toEqual('/game/pool/player/john')
});
