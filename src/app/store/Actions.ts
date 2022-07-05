import { action, makeObservable } from "mobx";

import { Data, TDocksMap, TShipMap } from "./Data";
import { ShipComponent } from "../components/shipComponent/ShipComponent";

export class Actions {
  private data: Data;

  constructor(data: Data) {
    makeObservable(this, {
      setDockActivation: action,
      setCountShips: action,
    })
    this.data = data;
  }

  public setDocks(docksMap: TDocksMap): void {
    this.data.docks = docksMap;
  }

  public setShips(shipsMap: TShipMap): void {
    this.data.ships = shipsMap;
  }

  public setDockActivation(keyDock: string): void {
    this.data.dockActivation = keyDock;
  }

  public deleteShip(keyShip: string): void {
    this.data.ships.delete(keyShip);
  }

  public setCountShips(number: number): void {
    this.data.countShips = number;
  }

  public setQueue(key: string, ship: ShipComponent): void {
    this.data.queue.set(key, ship);
  }

  public deleteShipFromQueue(keyShip: string): void {
    this.data.queue.delete(keyShip);
  }
}
