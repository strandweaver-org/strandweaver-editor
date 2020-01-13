import * as tokens from "@App/language/Tokens"
import * as P from 'parsimmon';

function displayPrettyErrors(failure: P.Failure) {
  return `${failure.expected.join("\n")}
            (Line: ${failure.index.line}, Column: ${failure.index.column})
   `
}
expect.extend({
  toBeATokenOfType(received: tokens.BaseToken, type: string) {
    if (received == null) {
      return {
        message: () => `expected an token of type ${type}, but was null`,
        pass: false,
      }

    }

    const receivedType: string = received.getType();
    if (receivedType != type) {
      return {
        message: () => `expected an token of type ${type}, but received an token of ${receivedType}`,
        pass: false,
      }
    }

    return {
      message: () => `expected to not get an token of type ${type}, but did `,
      pass: true
    }
  },
  toBeAKnotWithName(received: tokens.BaseToken | null, name: string) {
    if (received == null) {
      return {
        message: () => `expected token to be a knot, but was null`,
        pass: false,
      }
    }

    if ((received as tokens.Knot).name == name) {
      return {
        message: () => `expected token to not be knot ${name}, but it was`,
        pass: true,
      };
    }

    return {
      message: () => `expected token to be a knot with name ${name}, but it was ${received} instead`,
      pass: false,
    }

  },
  toBeAKnot(received: tokens.BaseToken | null) {
    if (received == null) {
      return {
        message: () => `expected token to be a knot, but was null`,
        pass: false,
      }
    }

    if (received as tokens.Knot) {
      return {
        message: () => `expected token to not be a knot, but was knot ${(received as tokens.Knot).name} `,
        pass: true,
      };
    }

    return {
      message: () => `expected token to be a knot, but it was ${received.constructor.name} `,
      pass: false,
    }
  },
  toParseCorrectly(received: P.Result<any>) {
    if (received.status == false) {
      return {
        message: () => `expected script to have no errors, but had errors:
      ${ displayPrettyErrors(received as P.Failure)} `,
        pass: false,
      };

    }

    return {
      message: () =>
        `expected script to have errors, but had no errors.`,
      pass: true,
    };
  }
});
