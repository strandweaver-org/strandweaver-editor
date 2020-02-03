import BaseToken from "./BaseToken";

export default class InlineTag extends BaseToken {
  public value: string;

  constructor(value: string) {
    super("InlineTag");
    this.value = value;
  }
}
