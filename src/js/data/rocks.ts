import { Coordinates } from "../lib/coordinates";
import { range, flatten } from "lodash";

function row(rng: [number, number], y: number): number[][] {
  return range(rng[0], rng[1] + 1).map(x => [x, y]);
}

const rocks: Coordinates[] = flatten([
  row([0, 18], 0),
  row([0, 13], 1), row([18, 20], 1),              [[40, 1]],
  row([0, 13], 2), row([18, 20], 2),
  row([0, 10], 3), [[13, 3]], row([19, 21], 3),
  row([0, 10], 4),                   row([38, 40], 4),
  row([0, 9], 5),                    row([38, 40], 5),
  row([0, 9], 6),                    row([38, 40], 6),
  row([0, 7], 7),                    row([38, 40], 7),
  row([0, 7], 8),
  row([0, 6], 9),  [[9, 16]],        row([38, 40], 9),
  row([0, 5], 10), [[10, 16]],       row([38, 40], 10),
  [[2, 11], [5, 11]],                row([37, 40], 11),
  [[5, 12], [6, 12]],                row([37, 40], 12),
  [[6, 13]],                         row([35, 40], 13),
  /* 14 */                           row([35, 40], 14),
  [[2, 15], [5, 15], [6, 15], [7, 15]], row([34, 40], 15),
  [[2, 16]],                         row([35, 40], 16),
  row([0, 4], 17),                    row([34, 40], 17),
  row([0, 4], 18),                    row([34, 40], 18),
  row([0, 4], 19),                    row([34, 40], 19),
  row([0, 6], 20), row([9, 14], 20),  row([36, 40], 20),
  row([0, 15], 21),                   row([37, 40], 21),
  row([0, 17], 22),                   row([39, 40], 22),
  row([0, 18], 23),
  row([0, 19], 24)

]).map((point: [number, number]) => (
  {x: point[0], y: point[1] }
));

export { rocks };
