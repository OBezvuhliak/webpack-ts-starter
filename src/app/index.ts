import * as PIXI from 'pixi.js'

import { CreateSlot } from "./conponents/createSlot";

const app = new PIXI.Application();
document.body.appendChild(app.view);
const lemonTexture = PIXI.Texture.from("../assets/images/lemon.png");

const container = new CreateSlot("lemon",lemonTexture, {x: app.screen.width / 2, y: app.screen.height / 2});
app.stage.addChild(container)
console.log(container)
