import { Area } from '../src/js/board/area';

// properties

test('area knows its size', () => {
  const area = new Area({x: 5, y: 5}, {x: 7, y: 8})

  expect(area.width).toBe(3);
  expect(area.height).toBe(4);
});

test('area should be able to present all of its cells', () => {
  const area = new Area({x: 10, y: 10}, {x: 11, y: 11})

  expect(area.cells).toEqual([
    {x: 10, y: 10},
    {x: 10, y: 11},
    {x: 11, y: 10},
    {x: 11, y: 11},
  ]);
});

test('area can even be the size of one cell', () => {
  const area = new Area({x: 10, y: 10}, {x: 10, y: 10})

  expect(area.cells).toEqual([{x: 10, y: 10}]);
  expect(area.width).toBe(1);
  expect(area.height).toBe(1);
});

// static builder

test('area can be built from an array of cells', () => {
  const area = Area.build([
    {x: 10, y: 10},
    {x: 10, y: 11},
    {x: 11, y: 10},
  ])

  expect(area.start).toEqual({x: 10, y: 10});
  expect(area.end).toEqual({x: 11, y: 11});
})

test('area can be built from a single cell', () => {
  const area = Area.build([
    {x: 10, y: 10}
  ])

  expect(area.start).toEqual({x: 10, y: 10});
  expect(area.end).toEqual({x: 10, y: 10});
})

// expansion
test('area should be able to expand', () => {
  const area = new Area({x: 10, y: 10}, {x: 11, y: 11}).expand(2)

  expect(area.start).toEqual({x: 8, y: 8});
  expect(area.end).toEqual({x: 13, y: 13});
});
