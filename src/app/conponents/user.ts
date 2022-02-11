interface IUser {
  firstName:string;
  lastName:string;
}
export class User {
  public _firstName:string;
  public _lastName:string;
  constructor(firstName:string,lastName:string) {
    this._firstName=firstName;
    this._lastName=lastName;
  }
}
