import { Coordinates } from "../lib/coordinates"

const rocks: Coordinates[] = [
  [7, 0], [8, 0], [9, 0], [10, 0], [11, 0],
  [7, 1], [9, 1],
  [6, 2], [8, 2], [13, 2], [14, 2],
  [6, 3], [7, 3], [8, 3],
  [7, 7]
].map((point: [number, number]) => (
  {x: point[0], y: point[1] }
));

export { rocks }
