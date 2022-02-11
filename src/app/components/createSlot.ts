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
    sprite.width=100;
    sprite.height=100;
    sprite.visible=false;
    this.x = position.x;
    this.y = position.y;
  }

}
