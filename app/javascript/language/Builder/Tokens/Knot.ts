import BaseToken from "./BaseToken";

export default class Knot extends BaseToken {
  static knotNameCounter = 0;
  public name: string;

  private static generateKnotName() {
    const name = `k_${this.knotNameCounter}`;
    this.knotNameCounter += 1;

    return name;
  }

  constructor(name?: string) {
    super("Knot");
    this.name = name === undefined ? Knot.generateKnotName() : name;
  }
}
