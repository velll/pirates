import { GridConfig, Grid } from "../../src/js/board/grid";
import { gameMap } from "./small-map";

const gridDimensions = { width: 1000, height: 1000 };

// 10 % offset and 80% width
const gridConfig: GridConfig = {
  X_OFFSET: 0.1,
  Y_OFFSET: 0.2,
  X_WIDTH: 0.8
};
const grid = new Grid(gameMap, gridDimensions, gridConfig);

const expectedCellSize = 80; // 800 pixels for 10 columns
const expectedStartPoint = {left: 100, top: 200};

export { grid, expectedCellSize, expectedStartPoint }