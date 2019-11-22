import { GridConfig } from '../board/grid';
import { MapConfig } from '../board/gamemap';

interface Config {
  map: MapConfig;
  grid: GridConfig;
}

const config: Config = {
  map: {
    rows: 23,
    columns: 41
  },
  grid: {
    X_OFFSET:  0.019 , // padding from left
    Y_OFFSET: 0.034, // padding from top
    X_WIDTH: 0.95 // width of active portion of the map
  }
};

export { config };
