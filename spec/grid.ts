import { grid, expectedCellSize, expectedStartPoint } from "./examples/even-grid";

test('grid should be able to calculate cell size', () => {
  expect(grid.cellSize).toEqual(expectedCellSize);
});

test('offsets should work', () => {
  expect(grid.getCellPosition({x: 0, y: 0})).toEqual(expectedStartPoint);
});

test('grid should be able to find cell position by coordinates', () => {
  expect(grid.getCellPosition({x: 2, y: 2})).toEqual({left: 260, top: 360});
});

test('grid should be able to locate a cell by a point on map', () => {
  expect(grid.locateCell({left: 500, top: 500})).toEqual({x: 5, y: 3});
});

test('grid should be able to offset positions within a cell', () => {
  expect(grid.offsetPosition({left: 100, top: 100}, {width: 10, height: 10})).toEqual(
    {left: 110, top: 110}
  )
})

test('grid should be able to offset positions within a cell by ratio', () => {
  expect(grid.getOffsettedPosition({x: 0, y: 0}, 0.8)).toEqual({left: 108, top: 208})
})
