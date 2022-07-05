import { Sprite } from "pixi.js";
import * as PIXI from "pixi.js";

import { PORT_HEIGHT } from "../../constants/PortConstants";

export class PassageComponent extends Sprite {
  private readonly _positionOnLayout: string;

  constructor(position: string) {
    super();
    this._positionOnLayout = position;
    this.init();
  }

  private init(): void {
    this.name=`passage_${this._positionOnLayout}`
    let yPosition;
    const heightPassage=PORT_HEIGHT / 2 - 100
    if (this._positionOnLayout === "top") {
      yPosition = 0;
    } else {
      yPosition = heightPassage + 200
    }
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFF300);
    graphics.drawRect(300, yPosition, 20, heightPassage);
    graphics.endFill();
    this.addChild(graphics);
  }
}
