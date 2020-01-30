import { ICompilerMessage, ICompilerResponse } from "@App/language/Compiler"

function prettyPrintMessages(messages: ICompilerMessage[]): string {
  return messages.map((msg: ICompilerMessage) => {
    return `[${msg.category}] ${msg.type}: ${msg.text}`
  }).join("\n")
}

expect.extend({
  toHaveNoCompilationMessages(res: ICompilerResponse) {
    if (res.messages.length == 0) {
      return {
        message: () =>
          `expected script to have compilation messages, but had no messages.`,
        pass: true,
      }
    }

    return {
      message: () => `expected the compilation to have no errors or warnings, but had:
    ${ prettyPrintMessages(res.messages)} `,
      pass: false,
    };



  },
  toCompileSuccessfully(res: ICompilerResponse) {
    if (res.success === true) {
      return {
        message: () => `expected the compilation to work, but had errors:
      ${ prettyPrintMessages(res.messages)} `,
        pass: true,
      };

    }

    return {
      message: () =>
        `expected script to not work, but it compiled successfully`,
      pass: false,
    };
  },
  toContainCompilationMessageOfType(res: ICompilerResponse, type: string) {
    if (res.success === true) {
      return {
        message: () =>
          `expected script to have messages of type ${type}, but had no messages.`,
        pass: false,
      };
    } else {
      const matchingMessages: ICompilerMessage[] = res.messages.filter(msg => msg.type === type)

      if (matchingMessages.length > 0) {
        return {
          message: () => `
      expected script to have no messages of type ${type}, but found matching messages:
      ${ prettyPrintMessages(matchingMessages)} `,
          pass: true,
        };
      } else {
        return {
          message: () => `
      expected script to have messages of type ${type}, but no matches were found:
      ${ prettyPrintMessages(matchingMessages)} `,
          pass: false,
        };
      }
    }
  },
});
