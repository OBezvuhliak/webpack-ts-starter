import { computed } from "mobx";

import { ShipComponent } from "../components/shipComponent/ShipComponent";
import { Data, TDocksMap, TShipMap } from "./Data";

export class Props {
  private data: Data;

  constructor(data: Data) {
    this.data = data;
  }

  @computed
  public get getDocks(): TDocksMap | Map<any, any> {
    return this.data.docks;
  }
  @computed
  public get getShips(): TShipMap | Map<any, any> {
    return this.data.ships;
  }
  // @computed
  public get dockActivation(): string {
    return this.data.dockActivation;
  }
  public get countShip(): number {
    return this.data.countShips;
  }
  public get queue():Map<string,ShipComponent> {
    return this.data.queue;
  }
}
