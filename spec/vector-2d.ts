import { Vector2d } from '../src/js/lib/vector-2d';

let verticalVector = new Vector2d({x: 0, y: 1});

let verticalRotatedBy90 = new Vector2d({x: -1, y: 0});
let verticalRotatedBy180 = new Vector2d({x: 0, y: -1});
let verticalRotatedBy45 = new Vector2d({x: -1, y: 1});

test('vertical vector can be turned by 90 deg', () => {
  const rotated = verticalVector.rotate(90);

  expect(rotated).toEqual(verticalRotatedBy90);
});

test('vertical vector can be turned by 180 deg', () => {
  const rotated = verticalVector.rotate(180)
  expect(rotated).toEqual(verticalRotatedBy180);
});

test('vertical vector can be turned by 45 deg', () => {
  const rotated = verticalVector.rotate(45);
  expect(rotated).toEqual(verticalRotatedBy45);
});

let diagonalVector = new Vector2d({x: 1, y: 1});

const diagonalRotatedBy90 = new Vector2d({x: -1, y: 1});
const diagonalRotatedBy180 = new Vector2d({x: -1, y: -1});
const diagonalRotatedBy45 = new Vector2d({x: 0, y: 1});

test('diagonal vector can be turned by 90 deg', () => {
  const rotated = diagonalVector.rotate(90);

  expect(rotated).toEqual(diagonalRotatedBy90);
});

test('diagonal vector can be turned by 180 deg', () => {
  const rotated = diagonalVector.rotate(180)
  expect(rotated).toEqual(diagonalRotatedBy180);
});

test('diagonal vector can be turned by 45 deg', () => {
  const rotated = diagonalVector.rotate(45);
  expect(rotated).toEqual(diagonalRotatedBy45);
});
