import TestClient from "@App/language/Clients/TestClient"

expect.extend({
  toDisplayTextMatching(client: TestClient, regex: RegExp) {
    const displayedText: string = client.currentDisplayedBlocks();

    if (regex.test(displayedText)) {
      return {
        message: () => `Expected to not find text matching regex ${regex}, but found\n${displayedText}`,
        pass: true
      }
    }

    return {
      message: () => `Could not find text matching regex: ${regex} in:\n${displayedText}`,
      pass: false
    }

  },
  toBeAtEndofScript(client: TestClient) {
    if (client.isStoryOver()) {
      return {
        message: () => `Expected story to not be over, but it was.`,
        pass: true
      }
    }

    return {
      message: () => `Expected story to be over, but it was not.`,
      pass: false
    }
  },
});
