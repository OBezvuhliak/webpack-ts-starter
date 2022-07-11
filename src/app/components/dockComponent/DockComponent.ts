import TWEEN from "@tweenjs/tween.js";
import { reaction } from "mobx";
import { Container, Sprite } from "pixi.js";
import * as PIXI from 'pixi.js';

import { PORT_HEIGHT } from "../../constants/PortConstants";
import { portProps } from "../../index";
import { ICoords, ShipComponent } from "../shipComponent/ShipComponent";

export class DockComponent extends Container {
  public numberDock: number;
  public isFull: boolean;
  public coordsJetty: ICoords;
  public isBusy: boolean;
  private _size = { width: 50, height: 150 };
  private fullSprite: Sprite;
  private emptySprite: Sprite;

  constructor(numberDock: number) {
    super();
    this.numberDock = numberDock;
    this.name = `dock_${numberDock + 1}`;
    this.isFull = true;
    this.coordsJetty = { x: 0, y: 0 };
    this.isBusy = false;
    const fullBG = PIXI.Texture.from('../assets/images/full-dock.png');
    const emptyBG = PIXI.Texture.from('../assets/images/empty-dock.png');
    this.fullSprite = new Sprite(fullBG);
    this.emptySprite = new Sprite(emptyBG);
    this.addChild(this.emptySprite);
    this.addChild(this.fullSprite);
    const padding = (PORT_HEIGHT / 4 - this._size.height) / 2;
    this.x = 0;
    this.y = padding + this.numberDock * (this._size.height + padding * 2);
    this.coordsJetty = {
      x: this._size.width + ShipComponent.size.width / 2,
      y: this.y + this._size.width + ShipComponent.size.height / 2
    };

  }

  public handlerOverload(shipName: string): void {
    const alphaFull = { a: 1, b: 0 };
    const alphaEmpty = { a: 0, b: 1 };
    const currentShip = portProps.getShips.get(shipName);
    if (currentShip) {
      const tween = new TWEEN.Tween(this.isFull ? alphaFull : alphaEmpty);
      tween.to(this.isFull ? alphaEmpty : alphaFull, 2000) // Move to (300, 200) in 1 second.
        // .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => {
          this.fullSprite.alpha = !this.isFull ? alphaEmpty.a : alphaFull.a;
          currentShip.fullSprite.alpha = currentShip.isFull ? alphaEmpty.b : alphaFull.b;
        }).onComplete(() => {
        this.isBusy = false;
        this.isFull = currentShip.isFull;
        currentShip.isFull = !currentShip.isFull;
        currentShip.angle = 180;
        currentShip.particleContainer.angle = 180;
        currentShip.goToEnd(this.coordsJetty);
      }).start();
    } else console.error("No currentShip");
  }

  // private getCurrentShip(): ShipComponent | undefined {
  //   let currentShip: ShipComponent | undefined;
  //   portProps.getShips.forEach((ship: ShipComponent) => {
  //     if (ship.currentDock === this.name) {
  //       currentShip = ship;
  //     } else {
  //       currentShip = undefined;
  //     }
  //   })
  //   return currentShip;
  // }
}
