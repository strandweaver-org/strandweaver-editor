declare namespace jest {
  interface Matchers<R, T> {
    toBeAKnot(): R;
    toBeAKnotWithName(name: string): R;
    toBeATokenOfType(type: string): R;
    toParseCorrectly(): R;
    toHaveNoCompilationErrors(): R;
    toContainCompilationError(constant: string): R;
  }
}