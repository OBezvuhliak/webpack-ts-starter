import { computed } from "mobx";

import { ShipComponent } from "../components/shipComponent/ShipComponent";
import { Data, TDocksMap, TShipMap } from "./Data";
import { portActions, portProps } from "../index";

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
  public get countFullShip(): number {
    return this.data.countFullShips;
  }
  public get countEmptyShip(): number {
    return this.data.countEmptyShips;
  }

  public get queue(): Map<string, ShipComponent> {
    return this.data.queue;
  }

  public get countShipInQueueFull(): number {
    let countShipInQueueFull = 0;
    portProps.queue.forEach((ship) => {
      if (ship.isFull) {
        countShipInQueueFull++;
      }
    });
    return countShipInQueueFull;
  }

  public get countShipInQueueEmpty(): number {
    let countShipInQueueEmpty = 0;
    portProps.queue.forEach((ship) => {
      if (!ship.isFull) {
        countShipInQueueEmpty++;
      }
    });
    return countShipInQueueEmpty;
  }
}
