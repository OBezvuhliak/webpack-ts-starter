import { BitmapText, Container } from "pixi.js";

import { PORT_WIDTH } from "../../constants/PortConstants";
import { reaction } from "mobx";
import { portProps } from "../../index";

export class DescriptionTextComponent extends Container {
  private bitmapFontText: BitmapText | undefined;

  constructor() {
    super();
    this.addReactions();
  }

  public init(): void {
    this.width = 300;
    this.x = PORT_WIDTH - 300;
    this.y = 0;
    this.bitmapFontText = new BitmapText('1', {
      fontName: 'TitanOne',
      fontSize: 55,
      align: 'left'
    });
    // bitmapFontText.x = 50;
    // bitmapFontText.y = 200;
    this.addChild(this.bitmapFontText);
  }

  private addReactions(): void {
    reaction(() => portProps.countShip, (countShip) => {
      if (this.bitmapFontText) {
        this.bitmapFontText.text = countShip.toString();
      }
    })
  }
}
