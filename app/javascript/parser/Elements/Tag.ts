import Element from './Element'

export default class Tag extends Element {

  public text: string;

  constructor(text: string) {
    super()
    this.text = text
  }

  getType(): string {
    return 'Tag';
  }
}