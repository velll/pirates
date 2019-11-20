import { Position } from './lib/position';
import { Dimensions } from './lib/dimensions';
import { Drawable } from './board';

class CanvasAdapter implements Drawable {
  public element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  private readonly TEXT_FONT: string = "15px Arial";
  private readonly TEXT_STYLE: string = "black";
  private readonly BOX_STROKE_STYLE: string = "grey";
  private readonly LINE_STROKE_STYLE: string = "rgba(102, 102, 102, 0.8)";

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d");
  }

  public setElementDimensions(dimensions: Dimensions) {
    this.element.width = dimensions.width;
    this.element.height = dimensions.height;
  }

  public drawLine(start: Position, finish: Position, color = this.LINE_STROKE_STYLE, width = this.ctx.lineWidth) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;

    // We're gonna need to leave it as it was before
    const originalWidth = this.ctx.lineWidth;
    this.ctx.lineWidth = width;

    this.ctx.moveTo(start.left, start.top);
    this.ctx.lineTo(finish.left, finish.top);
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.lineWidth = originalWidth;
  }

  public drawCross(pos: Position, width: number) {
    this.drawLine(pos, {left: pos.left + width, top: pos.top + width});
    this.drawLine(
      {left: pos.left, top: pos.top + width},
      {left: pos.left + width, top: pos.top});
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

  public drawSquare(pos: Position, width: number, color: string) {
    this.drawBox(pos, {width: width, height: width}, color);
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

  public clear(position: Position, dimensions: Dimensions) {
    this.ctx.clearRect(position.left, position.top, dimensions.width, dimensions.height);
  }

  public clearSquare(position: Position, width: number) {
    this.clear(position, {width: width, height: width});
  }

  public clearAll() {
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
  }
}

export { CanvasAdapter };
