import BaseToken from './BaseToken'

export default class Jump extends BaseToken {

  public location: string;

  constructor(location: string) {
    super('Jump')
    this.location = location
  }
}