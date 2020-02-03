declare namespace jest {
  interface Matchers<R, T> {
    toBeAKnot(): R;
    toBeAKnotWithName(name: string): R;
    toBeATokenOfType(type: string): R;
    toParseCorrectly(): R;
    toCompileSuccessfully(): R;
    toHaveNoCompilationMessages(): R;
    toHaveElementValue(index: number, property: string, value: any): R;
    toContainCompilationMessageOfType(type: string): R;
    toDisplayTextMatching(regex: RegExp): R;
    toBeAtEndOfScript(): R;
  }
}