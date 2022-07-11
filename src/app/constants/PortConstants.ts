import { ICoords } from "../components/shipComponent/ShipComponent";

export const PORT_WIDTH = 1200;
export const PORT_HEIGHT = 800;
export const SHIP_SIZE = { width: 100, height: 50 };
export const COORDS_QUEUE_FULL: ICoords = { x: 320 + SHIP_SIZE.width / 2, y: 315 + SHIP_SIZE.height / 2 };
export const COORDS_QUEUE_EMPTY: ICoords = { x: 320 + SHIP_SIZE.width / 2, y: 455 + SHIP_SIZE.height / 2 }


