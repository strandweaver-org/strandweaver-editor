import Token from './Token'

export default class Comment extends Token {

  public text: string

  constructor(text: string) {
    super()
    this.text = text
  }

  public getType(): string {
    return 'Comment';
  }
}