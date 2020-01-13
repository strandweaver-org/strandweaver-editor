import BaseToken from './BaseToken'

export default class Paragraph extends BaseToken {

  public text: string;

  constructor(text: string) {
    super()
    this.text = text
  }

  getType(): string {
    return 'Paragraph';
  }
}