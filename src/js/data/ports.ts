import { Port } from '../board/gamemap';
import { spaniards, pirates, neutrals, Fleet } from '../game/fleet'

const ports: Port[] = [
 [13, 1,  "Newfoundland",       neutrals, "french"],
 [6, 7,   "Maryland peninsula", pirates],
 [10, 12, "Bermudas",           spaniards],
 [2, 16,  "Havana",             spaniards],
 [4, 22,  "Porto Bello",        spaniards],
 [5, 18,  "Santiago",           spaniards],
 [6, 17,  "Tortuga",            pirates],
 [8, 18,  "Santo Domingo",      spaniards],
 [12, 19, "Guadalupe",          neutrals, "french"],
 [12, 22, "Trinidad",           pirates],
 [13, 23, "Guyana",             neutrals, "dutch"],
 [37, 1,  "Lands End",          neutrals, "french"],
 [36, 5,  "Bay of Biscay",      spaniards],
 [35, 8,  "Lisbon",             neutrals, "portuguese"],
 [37, 9,  "Cadiz",              spaniards],
 [28, 8,  "Azores",             neutrals, "portuguese"],
 [32, 11, "Madeira",            neutrals, "portuguese"],
 [31, 13, "Canary island",      spaniards],
 [28, 19, "Cabo Verde island",  neutrals, "portuguese"],
 [31, 20, "Cabo Verde",         neutrals, "portuguese"]

].map((cell: [number, number, string, Fleet]) => (
  {x: cell[0], y: cell[1], name: cell[2], fleet: cell[3]}
));

export { ports };
