import BaseToken from './BaseToken'

export default class Comment extends BaseToken {

  public text: string

  constructor(text: string) {
    super('Comment')
    this.text = text
  }
}