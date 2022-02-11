import * as PIXI from 'pixi.js';

import icons from "../assets/data/icon.json"
import { Button } from "./components/button";
import { CreateSlot } from "./components/createSlot";

const app = new PIXI.Application();
document.body.appendChild(app.view);

icons.forEach(icon => {
  const texture = PIXI.Texture.from(icon.url)
  const container = new CreateSlot(icon.name, texture, {x: app.screen.width / 2, y: app.screen.height / 2});
  app.stage.addChild(container)
})

const buttonStartTexture = PIXI.Texture.from("../assets/images/button.png")
const buttonStopTexture = PIXI.Texture.from("../assets/images/button-stop.png")

const button = new Button("button", buttonStartTexture, buttonStopTexture, {
  x: app.screen.width / 2,
  y: app.screen.height - 100
})
app.stage.addChild(button)


