import TWEEN from '@tweenjs/tween.js';
import { values } from "mobx";
import * as PIXI from 'pixi.js';
import { Container, Sprite } from "pixi.js";

import { PORT_HEIGHT, PORT_WIDTH } from "../../constants/PortConstants";
import { portActions, portProps } from "../../index";
import { TDocksMap } from "../../store/Data";

export interface IShipProps {
  isFull: boolean;
  name: string;
}

export interface ICoords {
  x: number;
  y: number;
}


export class ShipComponent extends Sprite {
  public static readonly size = { width: 100, height: 50 };
  private readonly _initCoords = { x: PORT_WIDTH + ShipComponent.size.width / 2, y: PORT_HEIGHT / 2 }

  public isFull: boolean;

  public isAction: boolean;
  public nomberOfQueue: number | undefined;

  private _shipContainer: Container;

  public currentDock = "";
  public fullSprite: Sprite;
  public emptySprite: Sprite;

  constructor(shipContainer: Container, shipProps: IShipProps) {
    super();
    this.isFull = shipProps.isFull;
    this.name = shipProps.name;
    this._shipContainer = shipContainer;
    this.isAction = false;
    const fullBG = PIXI.Texture.from('../assets/images/full-ship.png');
    const emptyBG = PIXI.Texture.from('../assets/images/empty-ship.png');
    this.fullSprite = new Sprite(fullBG);
    this.emptySprite = new Sprite(emptyBG);
    this.fullSprite.anchor.set(0.5);
    this.emptySprite.anchor.set(0.5);
    this.addChild(this.emptySprite);
    this.addChild(this.fullSprite);
    if (shipProps.isFull) {
      this.fullSprite.alpha = 1
    } else {
      this.fullSprite.alpha = 0
    }
    this.init();
  }

  protected init(): void {
    this.y = this._initCoords.y;
    this.x = this._initCoords.x;
    const docks = portProps.getDocks;
    docks.forEach((value, key) => {
      if (!value.isBusy && value.isFull !== this.isFull && !this.isAction) {
        this.currentDock = key;
        this.goToDock(key);
        value.isBusy = true;
        docks.set(key, value);
        portActions.setDocks(docks);
        this.isAction = true;
      }
    })
    if (!this.isAction) {
      this.goToQueue(this.isFull);
      this.isAction = true;
      portActions.setQueue(this.name, this);
    }
  }

  private goToDock(key: string): void {
    const currentDock = portProps.getDocks.get(key);

    const x0 = this._initCoords.x;
    const y0 = this._initCoords.y;
    const xA = [320, currentDock.coordsJetty.x];
    const yA = [this._initCoords.y, currentDock.coordsJetty.y];
    const obj = { x: x0, y: y0, old: { x: x0, y: y0 } }

    if (currentDock) {
      const tween = new TWEEN.Tween(obj);
      tween.to({ x: xA, y: yA }, 5000)
        // .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((object) => {
          // console.log(object);
          this.x = object.x;
          this.y = object.y;
          object.old.x = object.x
          object.old.y = object.y
        }).interpolation(TWEEN.Interpolation.CatmullRom).onComplete(() => {
        portProps.getDocks.get(key).handlerOverload(this.name);
        TWEEN.remove(tween);
      });
      tween.start();
    }
  }

  public goToQueue(isFull: boolean, initCoords?: ICoords): void {
    let coordsQueue: ICoords;
    let coords;
    if (initCoords) {
      coords = initCoords;
      if (this.nomberOfQueue) {
        this.nomberOfQueue--;
      }
    } else {
      coords = { x: this._initCoords.x, y: this._initCoords.y };
      let number = 0;
      portProps.queue.forEach((value) => {
        if (value.isFull === isFull) {
          number++;
        }
      });
      this.nomberOfQueue = number + 1;
    }

    if (this.nomberOfQueue) {
      if (isFull) {
        coordsQueue = {
          x: (320 + ShipComponent.size.width / 2) + (this.nomberOfQueue - 1) * (ShipComponent.size.width + 10),
          y: 315 + ShipComponent.size.height / 2
        }
      } else {
        coordsQueue = {
          x: (320 + ShipComponent.size.width / 2) + (this.nomberOfQueue - 1) * (ShipComponent.size.width + 10),
          y: 435 + ShipComponent.size.height / 2
        }
      }
      const tween = new TWEEN.Tween(coords); // Create a new tween that modifies 'coords'.
      tween.to(coordsQueue, 4000) // Move to (300, 200) in 1 second.
        // .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => {
          this.x = coords.x;
          this.y = coords.y;
        }).onComplete(() => {
        this.isAction = false;
      })
        .start() // Start the tween immediately.

    }
  }

  public goToEnd(coordsJetty: ICoords): void {
    const x0 = coordsJetty.x;
    const y0 = coordsJetty.y;
    const xA = [320, this._initCoords.x];
    const yA = [this._initCoords.y, this._initCoords.y];
    const obj = { x: x0, y: y0, old: { x: x0, y: y0 } }

    const tween = new TWEEN.Tween(obj);
    tween.to({ x: xA, y: yA }, 5000)
      .onUpdate((object) => {
        this.x = object.x;
        this.y = object.y;
        object.old.x = object.x
        object.old.y = object.y
      })
      .interpolation(TWEEN.Interpolation.CatmullRom)
      .onComplete(() => {
        portActions.deleteShip(this.name);
        const parent = this.parent;
        parent.removeChild(this);
        TWEEN.removeAll;
      });
    tween.start();
  }

  public goToDockFromQueue(): void {
    portActions.deleteShipFromQueue(this.name);
    const currentDock = portProps.getDocks.get(this.currentDock);
    const coordsStart = { x: this.x, y: this.y };
    const coordsPassage = { x: 320, y: this._initCoords.y };
    const tween1 = new TWEEN.Tween(coordsStart);
    const tween2 = new TWEEN.Tween(coordsPassage);
    tween1.to({ x: 320, y: this._initCoords.y }, 1000)
      .onUpdate(() => {
        this.x = coordsStart.x;
        this.y = coordsStart.y;
      });
    tween2.to({
      x: currentDock.coordsJetty.x,
      y: currentDock.coordsJetty.y
    }, 1000)
      .onUpdate(() => {
        this.x = coordsPassage.x;
        this.y = coordsPassage.y;
      }).onComplete(() => {
      portProps.getDocks.get(this.currentDock).handlerOverload(this.name);
    });
    tween1.chain(tween2);
    tween1.start();
  }
}
