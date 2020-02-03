export interface BuildScriptLocation {
  offset: number;
  line: number;
  column: number;
}

export interface BuildMessageHandler {
  (
    type: BuildMessageType,
    value?: string,
    location?: BuildScriptLocation
  ): void;
}

export enum BuildMessageType {
  InvalidKnotName = "InvalidKnotName",
  KnotNameReserved = "KnotNameReserved",
  KnotNameAlreadyDefined = "KnotNameAlreadyDefined",
  JumpLocationNotFound = "JumpLocationNotFound",
  ParseError = "ParseError"
}

export enum BuildMessageCategory {
  Error = "Error",
  Warning = "Warning"
}

export interface BuildMessage {
  category: BuildMessageCategory;
  type: string;
  text: string;
  location?: BuildScriptLocation;
}

export interface BuildMessageGenerator {
  category: BuildMessageCategory;
  text: (v: string) => string;
}

const generators: { [key in BuildMessageType]: BuildMessageGenerator } = {
  ParseError: {
    category: BuildMessageCategory.Error,
    text: (v: string): string => v
  },
  InvalidKnotName: {
    category: BuildMessageCategory.Error,
    text: (v: string): string =>
      `${v} is an invalid knot name.\nKnot names must start with a letter and contain only letters, numbers, and underscores`
  },
  KnotNameReserved: {
    category: BuildMessageCategory.Error,
    text: (): string =>
      `The knot name DONE or END is reserved for ending a story.`
  },
  KnotNameAlreadyDefined: {
    category: BuildMessageCategory.Error,
    text: (v: string): string => `The knot name ${v} has already been defined.`
  },
  JumpLocationNotFound: {
    category: BuildMessageCategory.Error,
    text: (v: string): string =>
      `Attempt to jump to a location ${v} that was not specified.`
  }
};

export function createBuildMessage(
  type: BuildMessageType,
  value?: string
): BuildMessage {
  const messageGen: BuildMessageGenerator = generators[type];

  return {
    category: messageGen.category,
    type,
    text: messageGen.text(value || "")
  };
}
