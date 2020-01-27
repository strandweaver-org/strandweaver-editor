export default abstract class BaseToken {
  public type: string
  public indentLevel: number
  private tags: Set<string>

  constructor(type: string, indentLevel?: number) {
    this.tags = new Set();
    this.type = type;
    this.indentLevel = indentLevel || 0;
  }

  public addTag(tag: string) {
    this.tags.add(tag);
  }

  public getTags(): string[] {
    return Array.from(this.tags);
  }
}
