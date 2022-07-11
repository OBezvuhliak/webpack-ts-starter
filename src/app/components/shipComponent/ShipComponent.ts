import * as particles from '@pixi/particle-emitter'
import { upgradeConfig } from "@pixi/particle-emitter";
import TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import {
  Application,
  Container,
  IPoint,
  ParticleContainer,
  Point,
  Sprite,
} from "pixi.js";

import { COORDS_QUEUE_EMPTY, COORDS_QUEUE_FULL, PORT_HEIGHT, PORT_WIDTH } from "../../constants/PortConstants";
import { portActions, portProps } from "../../index";
import shipEmitter from "./shipEmitter.json";

export interface IShipProps {
  isFull: boolean;
  name: string;
}

export interface ICoords {
  x: number;
  y: number;
}


export class ShipComponent extends Container {
  public static readonly size = { width: 100, height: 50 };
  private readonly _initCoords = { x: PORT_WIDTH + ShipComponent.size.width / 2, y: PORT_HEIGHT / 2 }

  public isFull: boolean;

  public isAction: boolean;
  public numberOfQueue: number | undefined;

  private _shipContainer: Container;
  public currentDock = "";
  public fullSprite: Sprite;
  public emptySprite: Sprite;
  private emitter: particles.Emitter;
  public particleContainer: ParticleContainer;
  private _app: Application;


  constructor(shipContainer: Container, shipProps: IShipProps, app: Application) {
    super();
    this.isFull = shipProps.isFull;
    this.name = shipProps.name;
    this._shipContainer = shipContainer;
    this._app = app;
    this.isAction = false;
    const fullBG = PIXI.Texture.from('../assets/images/full-ship.png');
    const emptyBG = PIXI.Texture.from('../assets/images/empty-ship.png');
    const trailTexture = PIXI.Texture.from('../assets/images/point.png');
    this.fullSprite = new Sprite(fullBG);
    this.emptySprite = new Sprite(emptyBG);
    this.particleContainer = new PIXI.ParticleContainer();
    // this._particleContainer.width = ShipComponent.size.width;
    // this._particleContainer.height = ShipComponent.size.height;
    this.particleContainer.name = this.name;
    this.particleContainer.setProperties({
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true,
    });

    this.fullSprite.anchor.set(0.5);
    this.emptySprite.anchor.set(0.5);
    this._shipContainer.addChild(this.particleContainer);
    this.addChild(this.emptySprite);
    this.addChild(this.fullSprite);
    this.emitter = new particles.Emitter(this.particleContainer, upgradeConfig(shipEmitter, [trailTexture]));

    if (shipProps.isFull) {
      this.fullSprite.alpha = 1
    } else {
      this.fullSprite.alpha = 0
    }
    this.init();
    this.updateEmitter();
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
    this.emitter.emit = true;
    const x0 = this._initCoords.x;
    const y0 = this._initCoords.y;
    const xA = [320, currentDock.coordsJetty.x];
    const yA = [this._initCoords.y, currentDock.coordsJetty.y];
    const obj = { x: x0, y: y0, old: { x: x0, y: y0 } }

    if (currentDock) {
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
          portProps.getDocks.get(key).handlerOverload(this.name);
          TWEEN.remove(tween);
          this.emitter.emit = false;
        });
      tween.start();
    }
  }

  public goToQueue(isFull: boolean): void {
    let number = 0;
    portProps.queue.forEach((value) => {
      if (value.isFull === isFull) {
        number++;
      }
    });
    this.numberOfQueue = number + 1;
    const coords = { x: this._initCoords.x, y: this._initCoords.y };
    let coordsQueue: ICoords;
    if (this.numberOfQueue) {
      if (isFull) {
        coordsQueue = {
          x: COORDS_QUEUE_FULL.x + (this.numberOfQueue - 1) * (ShipComponent.size.width + 10),
          y: COORDS_QUEUE_FULL.y
        }
      } else {
        coordsQueue = {
          x: COORDS_QUEUE_EMPTY.x + (this.numberOfQueue - 1) * (ShipComponent.size.width + 10),
          y: COORDS_QUEUE_EMPTY.y
        }
      }
      const tween = new TWEEN.Tween(coords);
      tween.to(coordsQueue, 4000)
        .onUpdate(() => {
          this.x = coords.x;
          this.y = coords.y;
        })
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onComplete(() => {
          this.isAction = false;
          const countCurrentQueue = this.isFull ? portProps.countShipInQueueFull : portProps.countShipInQueueEmpty;
          if (this.numberOfQueue && (this.numberOfQueue - countCurrentQueue) > 0) {
            this.advanceInLine(1);
          }
          this.emitter.emit = false;
        })
        .start();
    }
  }

  public advanceInLine(onSteps: number): void {
    this.isAction = true;
    if (this.numberOfQueue) {
      this.numberOfQueue--;
    }
    const coords = { x: this.x };
    const coordsQueue = { x: this.x - (ShipComponent.size.width + 10) * onSteps };
    const tween = new TWEEN.Tween(coords);
    tween.to(coordsQueue, 1000)
      .onUpdate(() => {
        this.x = coords.x;
      })
      .onComplete(() => {
        this.isAction = false;
      })
      .start();

  }

  public goToEnd(coordsJetty: ICoords): void {
    const x0 = coordsJetty.x;
    const y0 = coordsJetty.y;
    const xA = [320, this._initCoords.x];
    const yA = [this._initCoords.y, this._initCoords.y];
    const obj = { x: x0, y: y0, old: { x: x0, y: y0 } }
    this.emitter.emit = true;
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
        parent.removeChild(this, this.particleContainer);
        TWEEN.removeAll;
      });
    tween.start();
  }

  public goToDockFromQueue(): void {
    this.emitter.emit = true;
    portActions.deleteShipFromQueue(this.name);
    const currentDock = portProps.getDocks.get(this.currentDock);
    const x0 = this.x;
    const y0 = this.y;
    const xA = [200, currentDock.coordsJetty.x];
    const yA = [this.isFull ? COORDS_QUEUE_FULL.y : COORDS_QUEUE_EMPTY.y, currentDock.coordsJetty.y];
    const obj = { x: x0, y: y0, old: { x: x0, y: y0 } }

    const tween = new TWEEN.Tween(obj);
    tween.to({ x: xA, y: yA }, 1500)
      .onUpdate((object) => {
        this.x = object.x;
        this.y = object.y;
        object.old.x = object.x;
        object.old.y = object.y;
      })
      .interpolation(TWEEN.Interpolation.CatmullRom)
      .onComplete(() => {
        portProps.getDocks.get(this.currentDock).handlerOverload(this.name);
        TWEEN.remove(tween);
        this.emitter.emit = false;
      });
    tween.start();
  }

  private updateEmitter = (): void => {
    console.log("updateEmitter")
    this._app.ticker.add(this.onTick, this);
  };

  private onTick(): void {
    const p: IPoint = this.particleContainer.toLocal(
      new Point(0, 0),
      this,
    );
    this.emitter.spawnPos.x = p.x;
    this.emitter.spawnPos.y = p.y;
    this.emitter.update(this._app.ticker.deltaMS * 0.001);
  }
}
