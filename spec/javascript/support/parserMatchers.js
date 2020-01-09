function displayPrettyErrors(res) {
  return `${res.expected.join("\n")}
            (Line: ${res.index.line}, Column: ${res.index.column})
   `
}
expect.extend({
  toBeAKnot(received, name) {
    if (received && received[0] == "knot") {
      if (name == undefined) {
        return {
          message: () => `expected element to not be a knot, but was knot ${received[1]}`,
          pass: true,
        };
      } else if (name == received[1]) {
        return {
          message: () => `expected element to not be knot ${name}, but it was`,
          pass: true,
        }
      } else {
        return {
          message: () => `expected element to be knot ${name}, but it was ${received[1]}`,
          pass: false,
        }
      }
    } else {
      return {
        message: () => `expected element to be a knot, but was ${received}`,
        pass: false,
      };

    }
  },
  toBeAValidScript(res) {
    if (res.status == true) {
      return {
        message: () =>
          `expected script to have errors, but had no errors.`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected script to have no errors, but had errors:
        ${displayPrettyErrors(res)}`,
        pass: false,
      };
    }
  },
  toContainScriptError(res, constant) {
    if (res.status == true) {
      return {
        message: () =>
          `expected script to have errors, but had no errors.`,
        pass: true,
      };
    } else {
      const matchingErrors = res.expected.filter(msg =>
        msg.startsWith(constant));


      if (matchingErrors.length >= 0) {
        return {
          message: () => `
            expected script to have no errors of type ${constant}, but found matching errors:
            ${displayPrettyErrors(res)}`,
          pass: true,
        };
      } else {
        return {
          message: () => `
            expected script to have errors of type ${constant}, but no matches were found:
            ${displayPrettyErrors(res)}`,
          pass: false,
        };
      }
    }
  },
});
