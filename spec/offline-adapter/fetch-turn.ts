// Offline adapter should respond in the same format as the real api

import { OfflineAdapter } from '../../src/js/api/adapters/offline-adapter'
import { FetchTurn } from '../../src/js/api/game/fetch-turn';

const adapter = new OfflineAdapter();
const fetchTurn = new FetchTurn(adapter);
const game_id = '22e04a30-0003-4339-9f3e-92d5f888ada9';
const turn_no = 21;

// FetchTurn request

test('has a path for FetchTurn', () => {
  expect(adapter.GET_RESPONSES).toHaveProperty(fetchTurn.PATH);
});

test('responds with something processible', async () => {
  const result = await fetchTurn.call({game_id: game_id, turn_no: turn_no})
  expect(result).toBeDefined();

  // console.log(result)

  // TODO: Custom matcher
  Object.getOwnPropertyNames(result).forEach(field => {
    expect((result as any)[field]).toBeDefined();
  })

});

