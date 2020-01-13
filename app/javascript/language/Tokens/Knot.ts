import Token from './Token'

export default class Knot extends Token {
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