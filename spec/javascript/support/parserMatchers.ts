import { Token, Knot } from "@App/language/Tokens"
import * as P from 'parsimmon';

function displayPrettyErrors(failure: P.Failure) {
  return `${failure.expected.join("\n")}
            (Line: ${failure.index.line}, Column: ${failure.index.column})
   `
}
expect.extend({
  toBeAnTokenOfType(received: Token, type: string) {
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
  toBeAKnotWithName(received: Token | null, name: string) {
    if (received == null) {
      return {
        message: () => `expected token to be a knot, but was null`,
        pass: false,
      }
    }

    if ((received as Knot).name == name) {
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
  toBeAKnot(received: Token | null) {
    if (received == null) {
      return {
        message: () => `expected token to be a knot, but was null`,
        pass: false,
      }
    }

    if (received as Knot) {
      return {
        message: () => `expected token to not be a knot, but was knot ${(received as Knot).name} `,
        pass: true,
      };
    }

    return {
      message: () => `expected token to be a knot, but it was ${received.constructor.name} `,
      pass: false,
    }
  },
  toBeAValidScript(received: P.Result<any>) {
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
  },
  toContainScriptError(received: P.Result<any>, constant: string) {
    if (received.status == true) {
      return {
        message: () =>
          `expected script to have errors, but had no errors.`,
        pass: true,
      };
    } else {
      const matchingErrors = received.expected.filter(msg =>
        msg.startsWith(constant));


      if (matchingErrors.length >= 0) {
        return {
          message: () => `
      expected script to have no errors of type ${ constant}, but found matching errors:
      ${ displayPrettyErrors(received)} `,
          pass: true,
        };
      } else {
        return {
          message: () => `
      expected script to have errors of type ${ constant}, but no matches were found:
      ${ displayPrettyErrors(received)} `,
          pass: false,
        };
      }
    }
  },
});
