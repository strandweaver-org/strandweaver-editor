import BaseToken from "./BaseToken";

export default class StandaloneComment extends BaseToken {
  public text: string;

  constructor(text: string) {
    super("StandaloneComment");
    this.text = text;
  }
}
