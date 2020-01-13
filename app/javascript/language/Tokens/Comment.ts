import Element from './Element'

export default class Comment extends Element {

  public text: string

  constructor(text: string) {
    super()
    this.text = text
  }

  public getType(): string {
    return 'Comment';
  }
}