import { map } from 'lodash';
import { Cell } from '../board/cell';
import { Features } from '../board/gamemap';

const ports: Cell[] = map([
 [13, 1, "Newfoundland"], // France
 [6, 7, "Maryland peninsula"], // Pirates
 [10, 12, "Bermudas"], // Spain
 [2, 16, "Havana"], // Spain
 [4, 22, "Porto Bello"], // Spain
 [5, 18, "Santiago"], // Spain
 [6, 17, "Tortuga"], // pirates
 [8, 18, "Santo Domingo"], // Spain
 [12, 19, "Guadalupe"], // France
 [12, 22, "Trinidad"], // pirates
 [13, 23, "Guyana"], // Netherlands
 [37, 1, "Lands End"], // pirates
 [36, 5, "Bay of Biscay"], // Spain
 [35, 8, "Lisbon"], // Portugal
 [28, 8, "Azores"], // Portugal
 [32, 11, "Madeira"], // Portugal
 [31, 13, "Canary island"], // Spain
 [28, 19, "Cabo Verde island"], // Portugal
 [31, 20, "Cabo Verde"] // Portugal
],
(point: [number, number, string]) => {
  return new Cell(point[0], point[1], point[2]);
});

const rocks: Cell[] = map([
  [7, 0], [8, 0], [9, 0], [10, 0], [11, 0],
  [7, 1], [9, 1],
  [6, 2], [8, 2], [13, 2], [14, 2],
  [6, 3], [7, 3], [8, 3],
  [7, 7]
],
(point: [number, number]) => {
  return new Cell(point[0], point[1]);
});

const features: Features = {
  ports: ports,
  rocks: rocks
};

export { features };
