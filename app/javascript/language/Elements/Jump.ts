import BaseElement from './BaseElement'

export default class Jump extends BaseElement {
  public location: string;

  constructor(location: string) {
    super('Jump')
    this.location = location;
  }
}