export default abstract class BaseToken {
  public type: string

  constructor(type: string) {
    this.type = type;
  }
}
