declare namespace jest {
  interface Matchers<R, T> {
    toBeAKnot(): R;
    toBeAKnotWithName(name: string): R;
    toBeAnElementOfType(type: string): R;
    toBeAValidScript(): R;
    toContainScriptError(constant: string): R;
  }
}