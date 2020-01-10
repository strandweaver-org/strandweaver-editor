module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleDirectories: [
    "node_modules",
    "app/javascript"
  ],
  globals: {
    tsConfig: "tsconfig.json",
    "ts-jest": {
      diagnostics: true
    }
  },
  roots: [
    "spec/javascript",
    "app/javascript"
  ],
  moduleNameMapper: {
    "^@App/(.*)$": "<rootDir>/app/javascript/$1",
    "^@Tests/(.*)$": "<rootDir>/spec/javascript/$1"
  },
  setupFilesAfterEnv: [
    "<rootDir>/spec/javascript/support/parserMatchers.ts"
  ]
}