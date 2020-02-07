import { turn, validCoordinates, invalidCoordinates } from './examples/exciting-turn'

test('each turn we must know where we can move', () => {
  expect(turn.isValidMove(validCoordinates)).toBe(true);
});

test('each turn we must know where we cannot move', () => {
  expect(turn.isValidMove(invalidCoordinates)).toBe(false);
});
