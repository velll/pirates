interface Coordinates {
  x: number,
  y: number
}

// cell size does change, so I'm calculating it below
interface Map {
  rows: number,
  columns: number,
}

class GameMap implements Map {
  rows: number = 25;
  columns: number = 37;
}

export { GameMap, Coordinates }