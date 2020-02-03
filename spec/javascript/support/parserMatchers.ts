import * as tokens from "@App/Language/Builder/Tokens";
import { BuildResponse } from "@App/Language/Builder/Response";
import { BuildMessage } from "@App/Language/Builder/Messages";

function displayMessages(messages: BuildMessage[]): string {
  return messages
    .map((message: BuildMessage) => {
      let txt = `\n[${message.category}] ${message.type}:`;
      if (message.location) {
        txt += ` Line: ${message.location.line}, Column: ${message.location.column}, Offset: ${message.location.offset}`;
      }
      txt += `\n${message.text}`;
      return txt;
    })
    .join("\n");
}

expect.extend({
  toBeATokenOfType(received: tokens.BaseToken, type: string) {
    if (received === null) {
      return {
        message: (): string =>
          `expected an token of type ${type}, but was null`,
        pass: false
      };
    }

    const receivedType: string = received.type;
    if (receivedType != type) {
      return {
        message: (): string =>
          `expected an token of type ${type}, but received an token of ${receivedType}`,
        pass: false
      };
    }

    return {
      message: (): string =>
        `expected to not get an token of type ${type}, but did `,
      pass: true
    };
  },
  toBeAKnotWithName(received: tokens.BaseToken | null, name: string) {
    if (received === null) {
      return {
        message: (): string => `expected token to be a knot, but was null`,
        pass: false
      };
    }

    if ((received as tokens.Knot).name === name) {
      return {
        message: (): string =>
          `expected token to not be knot ${name}, but it was`,
        pass: true
      };
    }

    return {
      message: (): string =>
        `expected token to be a knot with name ${name}, but it was ${received} instead`,
      pass: false
    };
  },
  toBeAKnot(received: tokens.BaseToken | null) {
    if (received === null) {
      return {
        message: (): string => `expected token to be a knot, but was null`,
        pass: false
      };
    }

    if (received as tokens.Knot) {
      return {
        message: (): string =>
          `expected token to not be a knot, but was knot ${
            (received as tokens.Knot).name
          } `,
        pass: true
      };
    }

    return {
      message: (): string =>
        `expected token to be a knot, but it was ${received.constructor.name} `,
      pass: false
    };
  },
  toParseCorrectly(received: BuildResponse) {
    if (received.success === false) {
      return {
        message: (): string =>
          `expected script to have no errors, but had errors:${displayMessages(
            received.messages
          )} `,
        pass: false
      };
    }

    return {
      message: (): string =>
        `expected script to have errors, but had no errors.`,
      pass: true
    };
  }
});
