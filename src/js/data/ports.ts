import { spaniards, pirates, neutrals, Fleet } from '../game/fleet';
import { t } from './i18n';

const portsData = [
 [16, 1,  t("ports.cinewfoundland"),    neutrals,  "france"],
 [8, 7,   t("ports.maryland"),          pirates,   "pirates"],
 [13, 9,  t("ports.bermudas"),          spaniards, "spain"],
 [5, 14,  t("ports.havana"),            spaniards, "spain"],
 [1, 16,  t("ports.campeche"),          spaniards, "spain"],
 [7, 20,  t("ports.portobello"),        spaniards, "spain"],
 [8, 15,  t("ports.santiago"),          spaniards, "spain"],
 [10, 15, t("ports.tortuga"),           pirates,   "pirates"],
 [11, 17, t("ports.santodomingo"),      spaniards, "spain"],
 [14, 17, t("ports.guadalupe"),         neutrals,  "france"],
 [15, 20, t("ports.trinidad"),          pirates,   "pirates"],
 [16, 21, t("ports.guyana"),            neutrals,  "netherlands"],
 [40, 0,  t("ports.lands_end"),         neutrals,  "britain"],
 [39, 3,  t("ports.bay_of_biscay"),     spaniards, "spain"],
 [37, 7,  t("ports.lisbon"),            neutrals,  "portugal"],
 [38, 8,  t("ports.cadiz"),             spaniards, "spain"],
 [30, 7,  t("ports.azores"),            neutrals,  "portugal"],
 [34, 9,  t("ports.madeira"),           neutrals,  "portugal"],
 [34, 12, t("ports.canaries"),          spaniards, "spain"],
 [30, 17, t("ports.caboverde_islands"), neutrals,  "portugal"],
 [33, 18, t("ports.caboverde"),         neutrals,  "portugal"]

].map((cell: [number, number, string, Fleet, string]) => (
  {coordinates: {x: cell[0], y: cell[1]}, name: cell[2], fleet: cell[3], nation: cell[4]}
));

export { portsData };
