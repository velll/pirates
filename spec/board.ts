import { board } from "./examples/simple-board";
import { expectedStartPoint } from "./examples/even-grid";

test('board will delegate calls to map', () => {
  expect(board.isPort({x: 5, y: 10})).toBe(true);
});

test('board will delegate calls to grid', () => {
  expect(board.getCellPosition({x: 0, y: 0})).toEqual(expectedStartPoint);
});
