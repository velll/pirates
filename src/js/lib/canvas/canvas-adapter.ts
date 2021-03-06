import { Position } from '../position';
import { Dimensions } from '../dimensions';
import { TemporaryContext } from './temporary-context';

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
  drawRadialGradient(position: Position, dimensions: Dimensions, colorStops: [ColorStop]): void;
  fill(color: string): void;

  clear(position: Position, dimensions: Dimensions): void;
  clearSquare(pos: Position, width: number): void;
  clearAll(): void;
}

interface ColorStop {
  stop: number,
  color: string
}

class CanvasAdapter implements Kanvas {

  public static getCanvas(id: string): CanvasAdapter {
    return new CanvasAdapter(document.getElementById(id) as HTMLCanvasElement);
  }

  public element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  private readonly START = {left: 0, top: 0};

  private readonly TEXT_FONT = "15px Arial";
  private readonly TEXT_STYLE = "black";
  private readonly BOX_STROKE_STYLE = "grey";
  private readonly LINE_STROKE_STYLE = "rgba(102, 102, 102, 0.8)";
  private readonly IMAGE_SHADOW_OFFSET = {x: 3, y: 3};
  private readonly SHADOW_COLOR = "grey";
  private readonly COVER = "rgba(1,1,1, 0.2)";

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d");
  }

  public setElementDimensions(dimensions: Dimensions) {
    this.element.width = dimensions.width;
    this.element.height = dimensions.height;
  }

  public getElementDimensions(): Dimensions {
    return {width: this.element.width, height: this.element.height};
  }

  public drawLine(start: Position, finish: Position, color = this.LINE_STROKE_STYLE, width = this.ctx.lineWidth) {
    this.withTmpContext(() => {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;
    }).do(() => {
      this.ctx.beginPath();
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
      this.ctx.strokeStyle = this.BOX_STROKE_STYLE;
      this.ctx.fillStyle = color;
    }).do(() => {
      this.ctx.beginPath();
      this.ctx.rect(pos.left, pos.top, dimensions.width, dimensions.height);
      this.ctx.stroke();
      this.ctx.closePath();

      this.ctx.fillRect(pos.left, pos.top, dimensions.width, dimensions.height);
    });
  }

  public drawSquare(pos: Position, width: number, color: string) {
    this.drawBox(pos, {width: width, height: width}, color);
  }

  // assumes the Image is square, so only has one size
  public drawImage(image: CanvasImageSource, position: Position, size: number, shadow = true) {
    this.withTmpContext(() => {
      if (shadow) {
        this.ctx.shadowColor = this.SHADOW_COLOR;
        this.ctx.shadowOffsetX = this.IMAGE_SHADOW_OFFSET.x;
        this.ctx.shadowOffsetY = this.IMAGE_SHADOW_OFFSET.y;
      }
    }).do(() => this.ctx.drawImage(image, position.left, position.top, size, size));
  }

  public drawBlurryCircle(pos: Position, rad: number, color: string) {
    const inner = rad * 0.25;
    const outer = rad * 0.75;
    const offset = outer * 1.5;

    const gradient = this.ctx.createRadialGradient(pos.left, pos.top, inner,
                                                   pos.left, pos.top, outer);

    // Make a donut
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(0.4, color);
    gradient.addColorStop(0.6, color);
    gradient.addColorStop(1, "transparent");

    this.withTmpContext(() =>
      this.ctx.fillStyle = gradient
    ).do(() =>
      this.ctx.fillRect(pos.left - offset, pos.top - offset, offset * 2, offset * 2)
    );
  }

  public drawText(text: string, pos: Position) {
    this.withTmpContext(() => {
      this.ctx.font = this.TEXT_FONT;
      this.ctx.fillStyle = this.TEXT_STYLE;
    }).do(() => this.ctx.fillText(text, pos.left, pos.top));
  }

  public drawRadialGradient(position: Position, dimensions: Dimensions, colorStops: ColorStop[]) {
    const center = {left: position.left + dimensions.width / 2,
                    top: position.top + dimensions.height / 2, };

    const radSmall =  0.1 * Math.min(dimensions.width, dimensions.height) / 2;
    const radLarge =  Math.max(dimensions.width, dimensions.height) / 2;

    const gradient = this.ctx.createRadialGradient(
                       center.left, center.top, radSmall,
                       center.left, center.top, radLarge);

    colorStops.forEach(stop => gradient.addColorStop(stop.stop, stop.color));

    // Fill with gradient
    this.withTmpContext(() => this.ctx.fillStyle = gradient).do(() => {
      this.ctx.fillRect(position.left, position.top, dimensions.width, dimensions.height);
    });
  }

  public fill(color: string) {
    this.drawBox(this.START, this.getElementDimensions(), color);
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

  private withTmpContext(initializer: () => void) {
    return new TemporaryContext(this.ctx, initializer);
  }
}

export { CanvasAdapter, ColorStop };
