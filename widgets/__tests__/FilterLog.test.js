const _ = require("lodash");
const FilterLog = require("../FilterLog");

const config = FilterLog.sanitizeConfig({
  type: FilterLog.CONFIG_TYPE,
  name: "Filter Logs",
  prefixTrimIndex: 0,
  col: 0,
  colspan: 1,
  row: 0,
  rowspan: 1,
  match: "error"
});

describe("FilterLog", () => {
  describe("sanitizeConfig", () => {
    describe("match config", () => {
      it("must be defined", () => {
        expect(() => {
          FilterLog.sanitizeConfig({
            type: FilterLog.CONFIG_TYPE,
            name: "Filter Logs",
            prefixTrimIndex: 0,
            col: 0,
            colspan: 1,
            row: 0,
            rowspan: 1
          });
        }).toThrow("missing required attribute 'match'");
      });

      it("must be a valid regExp", () => {
        expect(() => {
          FilterLog.sanitizeConfig({
            type: FilterLog.CONFIG_TYPE,
            name: "Filter Logs",
            prefixTrimIndex: 0,
            col: 0,
            colspan: 1,
            row: 0,
            rowspan: 1,
            match: "aa("
          });
        }).toThrow("must be a valid regular expression");
      });

      it("is getting compiled to regExp object", () => {
        const vConfig = FilterLog.sanitizeConfig({
          type: FilterLog.CONFIG_TYPE,
          name: "Filter Logs",
          prefixTrimIndex: 0,
          col: 0,
          colspan: 1,
          row: 0,
          rowspan: 1,
          match: "warning"
        });

        expect(_.isRegExp(vConfig.matcher)).toBeTruthy();
      });
    }); // describe match
  }); // describe sanitizeConfig

  describe("constructor", function() {
    it("sets the clean config on the object", () => {
      const widget = new FilterLog({ set: jest.fn() }, config);
      expect(widget.config.name).toBe(config.name);
    });
  });

  describe("newLine", () => {
    test("send to the log widget a log line match", () => {
      const msg = "API return error code 500";
      const widget = new FilterLog({ set: jest.fn() }, config);
      widget.rollingLog = { log: jest.fn() };
      widget.newLine(msg);
      expect(widget.rollingLog.log).toHaveBeenCalledWith(msg);
    });
    test("send to the log widget a log line match", () => {
      const msg = "API return success code 200";
      const widget = new FilterLog({ set: jest.fn() }, config);
      widget.rollingLog = { log: jest.fn() };
      widget.newLine(msg);
      expect(widget.rollingLog.log).not.toHaveBeenCalled();
    });
  });
});
