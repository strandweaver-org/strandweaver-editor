import Token from './Token'

export default class Paragraph extends Token {

  public text: string;

  constructor(text: string) {
    super()
    this.text = text
  }

  getType(): string {
    return 'Paragraph';
  }
}