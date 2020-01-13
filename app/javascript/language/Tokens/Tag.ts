import Token from './Token'

export default class Tag extends Token {

  public value: string;

  constructor(value: string) {
    super()
    this.value = value
  }

  getType(): string {
    return 'Tag';
  }
}