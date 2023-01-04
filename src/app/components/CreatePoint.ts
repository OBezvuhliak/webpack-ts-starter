import { Graphics, IPoint, Point } from "pixi.js";

export class CreatePoint extends Graphics {
  private number: number;
  private lastPoint: IPoint;
  private currentPointOfTriangle: IPoint | undefined;

  constructor(number: number, pointsTriangle: Map<string, IPoint>, lastPoint: IPoint) {
    super();
    this.number = number;
    this.lastPoint = lastPoint;
    let point;
    if (number === 1 || number === 2) {
      point = pointsTriangle.get("pointTriangle_1");
    } else if (number === 3 || number === 4) {
      point = pointsTriangle.get("pointTriangle_2");
    } else if (number === 5 || number === 6) {
      point = pointsTriangle.get("pointTriangle_3");
    }
    if (point) {
      this.currentPointOfTriangle = new Point(point);
    }
    this.init();
  }

  private init(): void {
    this.beginFill(0x1f1e1d);
    this.lineStyle({ color: 0x111111, alpha: 0.87, width: 1 });
    this.drawCircle(0, 0, 3);
    this.endFill();
    const newPosition = this.getPosition();
    this.position.set(this.lastPoint.x + this.number * 10, this.lastPoint.y + this.number * 10);
  }

  private getPosition() {
  }
}
