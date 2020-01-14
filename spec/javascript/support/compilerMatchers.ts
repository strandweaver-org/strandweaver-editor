import { ICompilerResponse } from "@App/language/Compiler"

function displayPrettyErrors(res: ICompilerResponse) {
  return res.errors.join("\n")
}

expect.extend({
  toHaveElementValue(res: ICompilerResponse, index: number, propertyName: string, expectedValue: string) {
    const expectedValueMsg = `expected element #${index}'s ${propertyName} to be ${expectedValue}`
    if (res.success == false) {
      return {
        message: () => `${expectedValueMsg}, 
          but there were compilation errors ${displayPrettyErrors(res)}`,
        pass: false
      }
    }

    const element = res.elements[index]
    if (element == undefined) {
      return {
        message: () => `${expectedValueMsg}, but there was no element at index ${index}`,
        pass: false
      }
    }

    const property = element[propertyName];
    if (property == undefined && expectedValue != undefined) {
      return {
        message: () => `${expectedValueMsg}, but there was no property ${propertyName}`,
        pass: false
      }
    }

    // little shortcut so you can pass property "getType" to call getType()
    const value = (property instanceof Function) ? property() : property;

    if (value != expectedValue) {
      return {
        message: () => `${expectedValueMsg}, but found value ${value}`,
        pass: false
      }
    }


    return {
      message: () => `expected element #${index}'s ${propertyName} to not be ${expectedValue}, but it was`,
      pass: true
    }


  },
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
