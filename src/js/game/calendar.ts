class Calendar {
  private readonly ONE_DAY = 24 * 60 * 60 * 1000;

  constructor(private readonly start: Date) {
  }

  public add(days: number): Date {
    return new Date(this.start.valueOf() + days * this.ONE_DAY);
  }
}

export { Calendar };
