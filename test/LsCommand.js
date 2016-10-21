import assert from "assert";

import exitWithCode from "./_exitWithCode";
import initFixture from "./_initFixture";
import LsCommand from "../src/commands/LsCommand";
import logger from "../src/logger";
import stub from "./_stub";

describe("LsCommand", () => {
  beforeEach((done) => {
    initFixture("LsCommand/basic", done);
  });

  it("should list changes", (done) => {
    const lsCommand = new LsCommand([], {});

    lsCommand.runValidations();
    lsCommand.runPreparations();

    stub(logger, "info", (message) => {
      assert.equal(message, "- package-1\n- package-2\n- package-3\n- package-4");
    });

    lsCommand.runCommand(exitWithCode(0, done));
  });

  // Both of these commands should result in the same outcome
  const filters = [
    { test: "should list changes for a given scope", flag: "scope", flagValue: "package-1"},
    { test: "should not list changes for ignored packages", flag: "ignore", flagValue: "package-@(2|3|4)"},
  ];
  filters.forEach((filter) => {
    it(filter.test, (done) => {
      const lsCommand = new LsCommand([], {[filter.flag]: filter.flagValue});

      lsCommand.runValidations();
      lsCommand.runPreparations();

      stub(logger, "info", (message) => {
        assert.equal(message, "- package-1");
      });

      lsCommand.runCommand(exitWithCode(0, done));
    });
  });
});
