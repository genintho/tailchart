const RawLog = require("../RawLog");
const config = RawLog.sanitizeConfig({
  type: "raw",
  name: "Raw Logs",
  prefixTrimIndex: 0,
  col: 0,
  colspan: 1,
  row: 0,
  rowspan: 1,
  highlights: {
    lines: [
      { color: "yellow", match: "warning" },
      { color: "red", match: "error" }
    ]
  }
});

describe("RawLog", () => {
  describe("sanitizeConfig", () => {
    describe("prefixTrimIndex", () => {
      it("defaults to 0 if missing", () => {
        const config = RawLog.sanitizeConfig({
          name: "Raw Logs",
          col: 0,
          colspan: 1,
          row: 0,
          rowspan: 1
        });
        expect(config.prefixTrimIndex).toBe(0);
      });
      it("keeps integer value", () => {
        const config = RawLog.sanitizeConfig({
          name: "Raw Logs",
          col: 0,
          colspan: 1,
          row: 0,
          rowspan: 1,
          prefixTrimIndex: 5
        });
        expect(config.prefixTrimIndex).toBe(5);
      });
    });
    describe("highlights", () => {
      it("defaults highlights is not set", () => {
        const config = RawLog.sanitizeConfig({
          name: "Raw Logs",
          col: 0,
          colspan: 1,
          row: 0,
          rowspan: 1
        });
        expect(config.highlightLines).toEqual([]);
      });
      it("throws if color is not set", () => {
        expect(() => {
          RawLog.sanitizeConfig({
            name: "Raw Logs",
            col: 0,
            colspan: 1,
            row: 0,
            rowspan: 1,
            highlights: {
              lines: [{ match: "warning" }]
            }
          });
        }).toThrow("color must be a string");
      });

      it("throws if match is not set", () => {
        expect(() => {
          RawLog.sanitizeConfig({
            name: "Raw Logs",
            col: 0,
            colspan: 1,
            row: 0,
            rowspan: 1,
            highlights: {
              lines: [{ color: "yellow" }]
            }
          });
        }).toThrow("match must be a string");
      });

      it("throws if color is not correct", () => {
        expect(() => {
          RawLog.sanitizeConfig({
            name: "Raw Logs",
            col: 0,
            colspan: 1,
            row: 0,
            rowspan: 1,
            highlights: {
              lines: [{ color: "something", match: "warning" }]
            }
          });
        }).toThrow("Valid colors are");
      });
    });
  });

  describe("constructor", function() {
    it("sets the clean config on the object", () => {
      const widget = new RawLog({ set: jest.fn() }, config);
      expect(widget.config.name).toBe(config.name);
    });
  });

  describe("newLine", () => {
    test("send to the log widget a simple log line", () => {
      const widget = new RawLog({ set: jest.fn() }, config);
      widget.rollingLog = { log: jest.fn() };
      widget.newLine("a");
      expect(widget.rollingLog.log).toHaveBeenCalledWith("a");
    });

    it("applies color tag when line match an line highlight", () => {
      const widget = new RawLog({ set: jest.fn() }, config);
      widget.rollingLog = { log: jest.fn() };
      widget.newLine("Something warning something");
      expect(widget.rollingLog.log).toHaveBeenCalledWith(
        "{yellow-fg}Something warning something{/yellow-fg}"
      );
    });

    it("applies color tag when line match an line highlight", () => {
      const widget = new RawLog(
        { set: jest.fn() },
        Object.assign({}, config, { prefixTrimIndex: 1 })
      );
      widget.rollingLog = { log: jest.fn() };
      widget.newLine("ab");
      expect(widget.rollingLog.log).toHaveBeenCalledWith("b");
    });
  });
});
