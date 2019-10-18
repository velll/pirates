class Cell {
  public x: number;
  public y: number;
  public name?: string;

  constructor(x: number, y: number, name: string = "") {
    this.x = x;
    this.y = y;
    this.name = name;
  }

  public equalTo(other: Cell): boolean {
    return (other.x == this.x && other.y == this.y);
  }
}

export { Cell };
