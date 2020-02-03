export default class Element {
  public type: string;
  public tags: Set<string>;

  constructor(type: string) {
    this.type = type;
    this.tags = new Set();
  }

  addTag(value: string): void {
    this.tags.add(value);
  }

  public getTags(): string[] {
    return Array.from(this.tags.values());
  }
}
