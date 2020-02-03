import BaseToken from "./BaseToken";

export default class StandaloneTag extends BaseToken {
  public value: string;

  constructor(value: string) {
    super("StandaloneTag");
    this.value = value;
  }
}
