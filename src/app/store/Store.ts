import { Actions } from "./Actions";
import { Data } from "./Data";
import { Props } from "./Props";

export class Store{
  protected _data: Data;

  protected _props: Props;

  protected _actions: Actions;

  constructor() {
    this._data = new Data();
    this._props = new Props(this._data);
    this._actions = new Actions(this._data)
  }
  public get props(): Props {
    return this._props;
  }
  public get actions(): Actions {
    return this._actions;
  }
}
