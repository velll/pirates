import { spaniards, pirates, neutrals, Fleet } from '../game/fleet';

const portsData = [
 [16, 1,  "Newfoundland",       neutrals,  "france"],
 [8, 7,   "Maryland peninsula", pirates,   "pirates"],
 [13, 9, "Bermudas",            spaniards, "spain"],
 [5, 14,  "Havana",             spaniards, "spain"],
 [1, 16,  "Campeche",           spaniards, "spain"],
 [7, 20,  "Porto Bello",        spaniards, "spain"],
 [8, 15,  "Santiago",           spaniards, "spain"],
 [10, 15,  "Tortuga",            pirates,   "pirates"],
 [11, 17,  "Santo Domingo",     spaniards, "spain"],
 [14, 17, "Guadalupe",          neutrals,  "france"],
 [15, 20, "Trinidad",           pirates,   "pirates"],
 [16, 21, "Guyana",             neutrals,  "netherlands"],
 [40, 0,  "Lands End",          neutrals,  "britain"],
 [39, 3,  "Bay of Biscay",      spaniards, "spain"],
 [37, 7,  "Lisbon",             neutrals,  "portugal"],
 [38, 8,  "Cadiz",              spaniards, "spain"],
 [30, 7,  "Azores",             neutrals,  "portugal"],
 [34, 9, "Madeira",            neutrals,  "portugal"],
 [34, 12, "Canary island",      spaniards, "spain"],
 [30, 17, "Cabo Verde island",  neutrals,  "portugal"],
 [33, 18, "Cabo Verde",         neutrals,  "portugal"]

].map((cell: [number, number, string, Fleet, string]) => (
  {coordinates: {x: cell[0], y: cell[1]}, name: cell[2], fleet: cell[3], nation: cell[4]}
));

export { portsData };
