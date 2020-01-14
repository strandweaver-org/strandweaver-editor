import BaseToken from './BaseToken'

export default class Tag extends BaseToken {

  public value: string;

  constructor(value: string) {
    super('Tag')
    this.value = value
  }
}