import { ICompilerResponse } from "@App/language/Compiler"

function displayPrettyErrors(res: ICompilerResponse) {
  return res.errors.join("\n")
}

expect.extend({
  toHaveNoCompilationErrors(res: ICompilerResponse) {
    if (res.success == true) {
      return {
        message: () => `expected the compilation to have no errors, but had errors:
      ${ displayPrettyErrors(res)} `,
        pass: true,
      };

    }

    return {
      message: () =>
        `expected script to have errors, but had no errors.`,
      pass: false,
    };
  },
  toContainCompilationError(res: ICompilerResponse, constant: string) {
    if (res.success == true) {
      return {
        message: () =>
          `expected script to have errors, but had no errors.`,
        pass: true,
      };
    } else {
      const matchingErrors = res.errors.filter(msg =>
        msg.startsWith(constant));


      if (matchingErrors.length >= 0) {
        return {
          message: () => `
      expected script to have no errors of type ${constant}, but found matching errors:
      ${ displayPrettyErrors(res)} `,
          pass: true,
        };
      } else {
        return {
          message: () => `
      expected script to have errors of type ${ constant}, but no matches were found:
      ${ displayPrettyErrors(res)} `,
          pass: false,
        };
      }
    }
  },
});
