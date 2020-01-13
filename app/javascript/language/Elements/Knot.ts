import BaseElement from './BaseElement'

export default class Knot extends BaseElement {
  static knotNameCounter = 0;
  public name: string;

  private static generateKnotName() {
    const name = `k_${this.knotNameCounter}`;
    this.knotNameCounter += 1

    return name
  }

  constructor(name?: string) {
    super()
    this.name = name == undefined ? Knot.generateKnotName() : name;

  }

  getType(): string {
    return 'Knot';
  }
}