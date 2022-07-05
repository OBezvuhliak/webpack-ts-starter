import { makeObservable, observable } from "mobx";

import { DockComponent } from "../components/dockComponent/DockComponent";
import { ShipComponent } from "../components/shipComponent/ShipComponent";


export type TDocksMap = Map<string, DockComponent>;
export type TShipMap = Map<string, ShipComponent>;

export class Data {
  public docks: TDocksMap;
  public ships: TShipMap;
  public dockActivation: string;
  public countShips: number;
  public queue: Map<any, any>;

  constructor() {
    makeObservable(this, { dockActivation: observable, countShips: observable });
    this.docks = new Map();
    this.ships = new Map();
    this.dockActivation = "";
    this.countShips = 0;
    this.queue = new Map();
  }
}
