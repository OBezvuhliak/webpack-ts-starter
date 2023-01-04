import './style.scss';
import './app/index';

import * as PIXI from "pixi.js";
import { Container, IPoint, Point } from "pixi.js";
import { CreatePoint } from "./app/components/CreatePoint";

(window as any).PIXI = PIXI;

const ticker = new PIXI.Ticker();
let time = 0;
const width = document.body.clientWidth;
const height = document.body.clientHeight;

const app = new PIXI.Application({ width, height, backgroundColor: 0x2980b9, antialias: true });
document.body.appendChild(app.view);

const pointsTriangle = new Map();
const lastPoint = new Point();

const textContainer = new Container();
textContainer.name = "textContainer";
const text = new PIXI.Text('0');
text.x = 20;
text.y = 10;
textContainer.addChild(text);
app.stage.addChild(textContainer);

const main = new Container();
main.name = "mainContainer";
main.width = width;
main.height = height;
app.stage.addChild(main);
// Enable interactivity!
main.interactive = true;

// Make sure the whole canvas area is interactive, not just the circle.
main.hitArea = app.screen;


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function randomPoint(delta) {
  time += delta;
  if (time >= 60) {
    const number = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    text.text = number;
    const newPoint = new CreatePoint(number, pointsTriangle, lastPoint);
    main.addChild(newPoint);
    lastPoint.set(newPoint.position.x, newPoint.position.y);
    time = 0;
  }
}

// Follow the pointer
main.addListener('pointerdown', (e) => {
  let color = 0xffffff;
  let diameter = 4;
  if (main.children.length === 3) {
    color = 0x1f1e1d;
    diameter = 3
    main.interactive = false;
    main.removeAllListeners();
    ticker.add(randomPoint);
    ticker.start();
    lastPoint.set(e.data.global.x, e.data.global.y);
  } else {
    pointsTriangle.set(`pointTriangle_${main.children.length + 1}`, e.data.global);
  }

  const point = new PIXI.Graphics()
    .beginFill(color)
    .lineStyle({ color: 0x111111, alpha: 0.87, width: 1 })
    .drawCircle(0, 0, diameter)
    .endFill();
  point.position.set(e.data.global.x, e.data.global.y);
  main.addChild(point);
});
