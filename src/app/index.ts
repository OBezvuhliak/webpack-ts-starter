import TWEEN from "@tweenjs/tween.js";
import * as PIXI from 'pixi.js';

import { DockComponent } from "./components/dockComponent/DockComponent";
import { PassageComponent } from "./components/passageComponent/PassageComponent";
import { IShipProps, ShipComponent } from "./components/shipComponent/ShipComponent";
import { PORT_HEIGHT, PORT_WIDTH } from "./constants/PortConstants";
import { Store } from "./store/Store";
import { RandomUtils } from "./utils/RandomUtils";
import { QueueComponent } from "./components/queueComponent/QueueComponent";

const store = new Store();
export const portProps = store.props;
export const portActions = store.actions;

// declare global {
//   interface Window {
//     mask: any;
//   }
// }

const animUtils: RandomUtils = RandomUtils.getInstance();
let time = 0;
let timeQueue = 0;
const delayShip = 7;
// const app = new PIXI.Application();
const app = new PIXI.Application({ width: PORT_WIDTH, height: PORT_HEIGHT, backgroundColor: 0x6ECDFF });
document.body.appendChild(app.view);
const stageShips = new PIXI.Container();
const stageDocks = new PIXI.Container();
const stagePassage = new PIXI.Container();
// stageDocks.x = 5;
// stageDocks.y = 5;
stagePassage.name = "passageContainer"
stageDocks.name = "docksContainer";
stageShips.name = "shipContainer";

stagePassage.addChild(new PassageComponent("top"));
stagePassage.addChild(new PassageComponent("bottom"));
for (let i = 0; i < 4; i++) {
  const newDock = new DockComponent(i);
  stageDocks.addChild(newDock);
  const docksMap = store.props.getDocks;
  docksMap.set(newDock.name, newDock);
  store.actions.setDocks(docksMap);
}
const createShip = (): void => {
  portActions.setCountShips(portProps.countShip + 1);
  const shipProps: IShipProps = {
    isFull: animUtils.shipLoading(),
    name: `ship_${portProps.countShip}`,
  }
  const newShip = new ShipComponent(stageShips, shipProps);
  stageShips.addChild(newShip);
  const shipsMap = store.props.getShips;
  shipsMap.set(newShip.name, newShip);
  store.actions.setShips(shipsMap);
}
const queueComponent = new QueueComponent();
const initPixi = (): void => {
  requestAnimationFrame(initPixi);
  app.stage.addChild(stagePassage);
  app.stage.addChild(stageDocks);
  app.stage.addChild(stageShips);
}
initPixi();

app.ticker.add((delta) => {
  time += delta;
  timeQueue += delta;
  TWEEN.update();
  if (store.props.getShips.size === 0) {
    createShip();
    time = 0;
  }
  if (time > delayShip * 60) {
    createShip();
    time = 0;
  }
  if (timeQueue > 60) {
    queueComponent.findShipInQueue();
    timeQueue = 0;
  }
});


