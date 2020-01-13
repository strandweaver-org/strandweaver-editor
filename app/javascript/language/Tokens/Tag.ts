import Element from './Element'

export default class Tag extends Element {

  public value: string;

  constructor(value: string) {
    super()
    this.value = value
  }

  getType(): string {
    return 'Tag';
  }
}