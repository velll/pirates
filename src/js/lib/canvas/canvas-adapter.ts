import { Position } from '../position';
import { Dimensions } from '../dimensions';

// Just so that it's all in one place
interface Kanvas {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  drawBox(pos: Position, dimesions: Dimensions, color: string): void;
  drawSquare(pos: Position, width: number, color: string): void;
  drawImage(image: CanvasImageSource, pos: Position, size: number): void;
  drawText(text: string, pos: Position): void;
  drawLine(start: Position, finish: Position, color?: string, width?: number): void;
  drawCross(pos: Position, width: number): void;

  clear(position: Position, dimensions: Dimensions): void;
  clearSquare(pos: Position, width: number): void;
  clearAll(): void;
}

class CanvasAdapter implements Kanvas {
  public element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  private readonly TEXT_FONT = "15px Arial";
  private readonly TEXT_STYLE = "black";
  private readonly BOX_STROKE_STYLE = "grey";
  private readonly LINE_STROKE_STYLE = "rgba(102, 102, 102, 0.8)";
  private readonly IMAGE_SHADOW_OFFSET = {x: 1, y: 1};
  private readonly SHADOW_COLOR = "grey";

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d");
  }

  public setElementDimensions(dimensions: Dimensions) {
    this.element.width = dimensions.width;
    this.element.height = dimensions.height;
  }

  public drawLine(start: Position, finish: Position, color = this.LINE_STROKE_STYLE, width = this.ctx.lineWidth) {
    this.withTmpContext(() => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;

      this.ctx.moveTo(start.left, start.top);
      this.ctx.lineTo(finish.left, finish.top);
      this.ctx.stroke();
      this.ctx.closePath();
    });
  }

  public drawCross(pos: Position, width: number) {
    this.drawLine(pos, {left: pos.left + width, top: pos.top + width});
    this.drawLine(
      {left: pos.left, top: pos.top + width},
      {left: pos.left + width, top: pos.top});
  }

  public drawBox(pos: Position, dimensions: Dimensions, color: string) {
    this.withTmpContext(() => {
      this.ctx.beginPath();
      this.ctx.rect(pos.left, pos.top, dimensions.width, dimensions.height);
      this.ctx.strokeStyle = this.BOX_STROKE_STYLE;
      this.ctx.stroke();
      this.ctx.closePath();

      this.ctx.fillStyle = color;
      this.ctx.fillRect(pos.left, pos.top, dimensions.width, dimensions.height);
    });
  }

  public drawSquare(pos: Position, width: number, color: string) {
    this.drawBox(pos, {width: width, height: width}, color);
  }

  // assumes the Image is square, so only has one size
  public drawImage(image: CanvasImageSource, position: Position, size: number) {
    this.withTmpContext(() => {
      this.ctx.shadowColor = this.SHADOW_COLOR;
      this.ctx.shadowOffsetX = this.IMAGE_SHADOW_OFFSET.x;
      this.ctx.shadowOffsetY = this.IMAGE_SHADOW_OFFSET.y;

      this.ctx.drawImage(image, position.left, position.top, size, size);
    });
  }

  public drawText(text: string, pos: Position) {
    this.withTmpContext(() => {
      this.ctx.font = this.TEXT_FONT;
      this.ctx.fillStyle = this.TEXT_STYLE;
      this.ctx.fillText(text, pos.left, pos.top);
    });
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

  private withTmpContext(callback: () => void) {
    this.ctx.save();
    callback();
    this.ctx.restore();
  }
}

export { CanvasAdapter };
