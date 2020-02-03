import BaseElement from "./BaseElement";

export default class Paragraph extends BaseElement {
  public text: string;
  constructor(text: string) {
    super("Paragraph");
    this.text = text;
  }
}
