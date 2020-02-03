import { BuildMessage } from "@App/Language/Builder/Messages";
import { BuildResponse } from "@App/Language/Builder/Response";

function prettyPrintMessages(messages: BuildMessage[]): string {
  return messages
    .map((msg: BuildMessage) => {
      return `[${msg.category}] ${msg.type}: ${msg.text}`;
    })
    .join("\n");
}

expect.extend({
  toHaveNoCompilationMessages(res: BuildResponse) {
    if (res.messages.length == 0) {
      return {
        message: (): string =>
          `expected script to have compilation messages, but had no messages.`,
        pass: true
      };
    }

    return {
      message: (): string => `expected the compilation to have no errors or warnings, but had:
    ${prettyPrintMessages(res.messages)} `,
      pass: false
    };
  },
  toCompileSuccessfully(res: BuildResponse) {
    if (res.success === true) {
      return {
        message: (): string => `expected the compilation to work, but had errors:
      ${prettyPrintMessages(res.messages)} `,
        pass: true
      };
    }

    return {
      message: (): string =>
        `expected script to not work, but it compiled successfully`,
      pass: false
    };
  },
  toContainCompilationMessageOfType(res: BuildResponse, type: string) {
    if (res.success === true) {
      return {
        message: (): string =>
          `expected script to have messages of type ${type}, but had no messages.`,
        pass: false
      };
    } else {
      const matchingMessages: BuildMessage[] = res.messages.filter(
        (msg: BuildMessage) => msg.type === type
      );

      if (matchingMessages.length > 0) {
        return {
          message: (): string => `
      expected script to have no messages of type ${type}, but found matching messages:
      ${prettyPrintMessages(matchingMessages)} `,
          pass: true
        };
      } else {
        return {
          message: (): string => `
      expected script to have messages of type ${type}, but no matches were found:
      ${prettyPrintMessages(matchingMessages)} `,
          pass: false
        };
      }
    }
  }
});
