class TemporaryContext {
  private context: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, initializer: () => void) {
    this.context = ctx;

    this.context.save();
    initializer();
  }

  public do(what: () => void) {
    what();
    this.context.restore();
  }
}

export { TemporaryContext };
