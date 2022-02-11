import * as PIXI from "pixi.js";

interface Position {
  x: number;
  y: number;
}

export class CreateSlot extends PIXI.Container {
  public constructor(name:string,texture: PIXI.Texture, position: Position) {
    super();
    this.name=name;
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    this.addChild(sprite)
    this.width=1;
    this.height=1;
    this.x = position.x;
    this.y = position.y;
  }

}
