import { User } from "./user";

export class Room extends User{
  constructor() {
    super("","");
  }
  public get userData ():User{
    return this;
  }
}
