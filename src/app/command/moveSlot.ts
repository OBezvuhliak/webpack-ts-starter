import * as PIXI from "pixi.js";

export class MoveSlot {
  protected _slots:PIXI.Container[];
  constructor(slots:PIXI.Container[]) {
    this._slots=slots
  }
}
