import { spaniards, pirates, neutrals, Fleet } from '../game/fleet';

const portsData = [
 [13, 1,  "Newfoundland",       neutrals,  "france"],
 [6, 7,   "Maryland peninsula", pirates,   "pirates"],
 [10, 12, "Bermudas",           spaniards, "spain"],
 [2, 16,  "Havana",             spaniards, "spain"],
 [4, 22,  "Porto Bello",        spaniards, "spain"],
 [5, 18,  "Santiago",           spaniards, "spain"],
 [6, 17,  "Tortuga",            pirates,   "pirates"],
 [8, 18,  "Santo Domingo",      spaniards, "spain"],
 [12, 19, "Guadalupe",          neutrals,  "france"],
 [12, 22, "Trinidad",           pirates,   "pirates"],
 [13, 23, "Guyana",             neutrals,  "netherlands"],
 [37, 1,  "Lands End",          neutrals,  "france"],
 [36, 5,  "Bay of Biscay",      spaniards, "spain"],
 [35, 8,  "Lisbon",             neutrals,  "portugal"],
 [37, 9,  "Cadiz",              spaniards, "spain"],
 [28, 8,  "Azores",             neutrals,  "portugal"],
 [32, 11, "Madeira",            neutrals,  "portugal"],
 [31, 13, "Canary island",      spaniards, "spain"],
 [28, 19, "Cabo Verde island",  neutrals,  "portugal"],
 [31, 20, "Cabo Verde",         neutrals,  "portugal"]

].map((cell: [number, number, string, Fleet, string]) => (
  {coordinates: {x: cell[0], y: cell[1]}, name: cell[2], fleet: cell[3], nation: cell[4]}
));

export { portsData };
