interface Coordinates {
  x: number;
  y: number;
}

interface Move {
  from: Coordinates;
  to: Coordinates;
}

export { Coordinates, Move };
