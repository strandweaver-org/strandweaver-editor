declare namespace jest {
  interface Matchers<R, T> {
    toBeAKnot(): R;
    toBeAKnotWithName(name: string): R;
    toBeAValidScript(): R;
    toContainScriptError(constant: string): R;
  }
}