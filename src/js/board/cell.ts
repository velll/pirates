class Cell {
  x: number;
  y: number;

  constructor(x: number, y: number, name: string = "") {
    this.x = x;
    this.y = y;
  }

  equalTo(other: Cell): boolean {
    return (other.x == this.x && other.y == this.y)
  }
}

export { Cell }