import { ICompilerMessage, ICompilerResponse } from "@App/language/Compiler"
import * as deepEqual from 'fast-deep-equal'

function prettyPrintMessages(messages: ICompilerMessage[]): string {
  return messages.map((msg: ICompilerMessage) => {
    return `[${msg.category}] ${msg.type}: ${msg.text}`
  }).join("\n")
}

expect.extend({
  toHaveElementValue(res: ICompilerResponse, index: number, propertyName: string, expectedValue: any) {
    const expectedValueMsg = `expected element #${index}'s ${propertyName} to be ${expectedValue}`
    if (res.success == false) {
      return {
        message: () => `${expectedValueMsg}, 
          but there were compilation problems:\n${prettyPrintMessages(res.messages)}`,
        pass: false
      }
    }

    const element = res.engine.elementList[index]
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

    const value = (property instanceof Function) ? property.call(element) : property;

    if (!deepEqual(value, expectedValue)) {
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
  toHaveNoCompilationMessages(res: ICompilerResponse) {
    if (res.success == true) {
      return {
        message: () => `expected the compilation to have no errors or warnings, but had:
      ${ prettyPrintMessages(res.messages)} `,
        pass: true,
      };

    }

    return {
      message: () =>
        `expected script to have compilation messages, but had no messages.`,
      pass: false,
    };

  },
  toCompileSuccessfully(res: ICompilerResponse) {
    if (res.success == true) {
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
    if (res.success == true) {
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
