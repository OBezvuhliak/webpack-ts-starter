import * as PIXI from "pixi.js";

interface Position {
  x: number;
  y: number;
}

interface TextureObj {
  name: string;
  texture: PIXI.Texture;
}

export class Button extends PIXI.Container {

  public constructor(name: string, textureStart: PIXI.Texture, textureStop: PIXI.Texture, position: Position) {
    super();
    this.addSprite([{name: "start", texture: textureStart}, {name: "stop", texture: textureStop}], position);
    this.interactive = true;
    this.buttonMode = true;
    this.on('pointerdown', this.onClick);
  }

  protected onClick(): void {
    this.children.forEach(sprite => {
      sprite.visible = !sprite.visible
    })
  }

  protected addSprite(textures: TextureObj[], position: Position): void {
    textures.forEach(texture => {
      const sprite = new PIXI.Sprite(texture.texture)
      sprite.name = texture.name
      sprite.width = 100;
      sprite.height = 100;
      sprite.x = position.x;
      sprite.y = position.y;
      sprite.anchor.set(0.5)
      if (texture.name === "stop") {
        sprite.visible = false
      }
      this.addChild(sprite)
    })
  }
}
