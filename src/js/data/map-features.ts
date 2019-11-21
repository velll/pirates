import { map } from 'lodash';
import { Coordinates, Port, Features } from '../board/gamemap';

enum Fleets {
  Pirates = "Pirates",
  Spaniards = "Spaniards",
  French = "French",
  Dutch = "Dutch",
  Portuguese = "Portuguese"
}

const ports: Port[] = map([
 [13, 1,  "Newfoundland",       "French"],
 [6, 7,   "Maryland peninsula", "Pirates"],
 [10, 12, "Bermudas",           "Spaniards"],
 [2, 16,  "Havana",             "Spaniards"],
 [4, 22,  "Porto Bello",        "Spaniards"],
 [5, 18,  "Santiago",           "Spaniards"],
 [6, 17,  "Tortuga",            "Pirates"],
 [8, 18,  "Santo Domingo",      "Spaniards"],
 [12, 19, "Guadalupe",          "French"],
 [12, 22, "Trinidad",           "Pirates"],
 [13, 23, "Guyana",             "Dutch"],
 [37, 1,  "Lands End",          "Pirates"],
 [36, 5,  "Bay of Biscay",      "Spaniards"],
 [35, 8,  "Lisbon",             "Portuguese"],
 [37, 9,  "Cadiz",              "Spaniards"],
 [28, 8,  "Azores",             "Portuguese"],
 [32, 11, "Madeira",            "Portuguese"],
 [31, 13, "Canary island",      "Spaniards"],
 [28, 19, "Cabo Verde island",  "Portuguese"],
 [31, 20, "Cabo Verde",         "Portuguese"]
],
(cell: [number, number, string, string]) => {
  return {x: cell[0], y: cell[1], name: cell[2], fleet: cell[3]};
});

const rocks: Coordinates[] = map([
  [7, 0], [8, 0], [9, 0], [10, 0], [11, 0],
  [7, 1], [9, 1],
  [6, 2], [8, 2], [13, 2], [14, 2],
  [6, 3], [7, 3], [8, 3],
  [7, 7]
],
(point: [number, number]) => {
  return {x: point[0], y: point[1] };
});

const features: Features = {
  ports: ports,
  rocks: rocks
};

export { features };
