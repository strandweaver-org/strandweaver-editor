import BaseToken from './BaseToken'

export default class Choice extends BaseToken {

  public text: string;

  constructor(text: string) {
    super('Choice')
    this.text = text
  }
}