import { Drawable } from '../board';
import { Position } from '../lib/position';

class MovingImage {
  private readonly FPS = 60;
  private readonly duration = 0.5; // seconds

  private canvas: Drawable;
  private image: CanvasImageSource;
  private imageSize: number;
  private start: Position;
  private finish: Position;

  private dx: number;
  private dy: number;

  private position: Position;

  constructor(
    canvas: Drawable,
    image: CanvasImageSource,
    imageSize: number,
    start: Position,
    finish: Position) {

      this.canvas = canvas;
      this.image = image;
      this.imageSize = imageSize;
      this.start = start;
      this.finish = finish;

      this.dx = (this.finish.left - this.start.left) / (this.FPS * this.duration);
      this.dy = (this.finish.top - this.start.top) / (this.FPS * this.duration);

      this.position = start;
  }

  public run() {
    // We'll flip it once we reach our finish
    let more = true;

    this.canvas.clear(this.position, {width: this.imageSize, height: this.imageSize});
    // Move by dx, dy
    this.position = {left: this.position.left + this.dx, top: this.position.top + this.dy};

    // Check if close enough
    if (Math.sqrt((this.position.left - this.finish.left) ** 2  +
                  (this.position.top - this.finish.top) ** 2) <=
       (Math.sqrt(this.dx ** 2 + this.dy ** 2))) {
          this.position = this.finish;
          more = false;
    }

    this.canvas.drawImage(this.image, this.position, this.imageSize);

    if (more) {
      requestAnimationFrame(this.run.bind(this));
    }
  }
}

export { MovingImage };
