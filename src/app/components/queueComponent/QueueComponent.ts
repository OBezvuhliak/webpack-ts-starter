import { portProps } from "../../index";

export class QueueComponent {
  public findShipInQueue(): void {
    portProps.getDocks.forEach((dock, keyDock) => {
      portProps.queue.forEach((ship) => {
        if (!dock.isBusy && dock.isFull !== ship.isFull && !ship.isAction) {
          dock.isBusy = true;
          ship.isAction = true;
          ship.currentDock = keyDock;
          ship.goToDockFromQueue();
          this.refreshQueue(ship.isFull)
        }
      })
    });
  }

  public refreshQueue(filling: boolean): void {
    portProps.queue.forEach((ship) => {
      if (ship.isFull === filling && !ship.isAction) {
        ship.isAction = true;
        ship.advanceInLine(1);
      }
    });
  }
}
