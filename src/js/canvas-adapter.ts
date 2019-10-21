import { Position } from './abstract/position';
import { Dimensions } from './abstract/dimensions';
import { Drawable } from './board';

class CanvasAdapter implements Drawable {
  public element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  private readonly TEXT_FONT: string = "15px Arial";
  private readonly TEXT_STYLE: string = "black";
  private readonly BOX_STROKE_STYLE: string = "grey";

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d");
  }

  public drawBox(pos: Position, dimensions: Dimensions, color: string) {
    this.ctx.beginPath();
    this.ctx.rect(pos.left, pos.top, dimensions.width, dimensions.height);
    this.ctx.strokeStyle = this.BOX_STROKE_STYLE;
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.fillStyle = color;
    this.ctx.fillRect(pos.left, pos.top, dimensions.width, dimensions.height);
  }

  // assumes the Image is square, so only has one size
  public drawImage(image: CanvasImageSource, position: Position, size: number) {
    this.ctx.drawImage(image, position.left, position.top, size, size);
  }

  public drawText(text: string, pos: Position) {
    this.ctx.font = this.TEXT_FONT;
    this.ctx.fillStyle = this.TEXT_STYLE;
    this.ctx.fillText(text, pos.left, pos.top);
  }
}

export { CanvasAdapter };
