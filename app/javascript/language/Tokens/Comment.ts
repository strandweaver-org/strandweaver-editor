import BaseToken from './BaseToken'

export default class Comment extends BaseToken {

  public text: string

  constructor(text: string) {
    super()
    this.text = text
  }

  public getType(): string {
    return 'Comment';
  }
}