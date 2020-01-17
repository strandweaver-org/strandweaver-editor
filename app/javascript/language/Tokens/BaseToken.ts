export default abstract class BaseToken {
  public type: string
  public indentLevel: number

  constructor(type: string, indentLevel?: number) {
    this.type = type;
    this.indentLevel = indentLevel || 0;
  }
}
