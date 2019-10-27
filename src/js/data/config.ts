import { GridConfig } from '../board/grid';
import { MapConfig } from '../board/gamemap';

interface Config {
  map: MapConfig;
  grid: GridConfig;
}

const config: Config = {
  map: {
    rows: 25,
    columns: 39
  },
  grid: {
    X_OFFSET: 0.0065, // padding from left
    Y_OFFSET: 0.043, // padding from top
    X_WIDTH: 0.9 // width of active portion of the map
  }
};

export { config };
