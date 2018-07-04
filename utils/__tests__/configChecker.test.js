const configChecker = require("../configChecker");
const RawLog = require("../../widgets/RawLog");

describe("utils/configChecker", () => {
  it("returns true when valud", () => {
    expect(
      configChecker({
        source: "a",
        widgets: [
          {
            name: "colspan invalid",
            type: RawLog.CONFIG_TYPE,
            row: 1,
            col: 1,
            rowspan: 1,
            colspan: 1
          }
        ]
      })
    ).toBe(true);
  });

  describe("source", () => {
    it("detect missing", () => {
      expect(() => {
        configChecker({});
      }).toThrow("must contain a 'source' ");
    });

    it("detect invalid", () => {
      expect(() => {
        configChecker({ source: 1 });
      }).toThrow("must contain a 'source' ");
    });
  });
  describe("widgets", () => {
    it("detect missing", () => {
      expect(() => {
        configChecker({ source: "a" });
      }).toThrow("must have at least 1 widget");
    });
    it("detect invalid", () => {
      expect(() => {
        configChecker({ source: "a", widgets: {} });
      }).toThrow("must have at least 1 widget");
    });
    it("detect empty", () => {
      expect(() => {
        configChecker({ source: "a", widgets: [] });
      }).toThrow("must have at least 1 widget");
    });
  });

  describe("individual widget", () => {
    it("detect empty", () => {
      expect(() => {
        configChecker({ source: "a", widgets: [1] });
      }).toThrow("is not an object");
    });
    describe("name", () => {
      it("detect missing", () => {
        expect(() => {
          configChecker({ source: "a", widgets: [{}] });
        }).toThrow("missing the required attribute 'name'");
      });
      it("detect invalid ", () => {
        expect(() => {
          configChecker({ source: "a", widgets: [{ name: 1 }] });
        }).toThrow("must be a string");
      });
      it("detect duplicate ", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [
              {
                type: RawLog.CONFIG_TYPE,
                name: "Sonos App Error type",
                match: "<Error> ([a-z]+)",
                col: 3,
                colspan: 1,
                row: 0,
                rowspan: 2
              },
              {
                type: RawLog.CONFIG_TYPE,
                name: "Sonos App Error type",
                match: "<Error> ([a-z]+)",
                col: 3,
                colspan: 1,
                row: 0,
                rowspan: 2
              }
            ]
          });
        }).toThrow("Multiple widgets with name");
      });
    });
    describe("type", () => {
      it("detect missing", () => {
        expect(() => {
          configChecker({ source: "a", widgets: [{ name: "1" }] });
        }).toThrow("must have a type");
      });
      it("detect invalid ", () => {
        expect(() => {
          configChecker({ source: "a", widgets: [{ name: "1", type: "1" }] });
        }).toThrow("an unknown type ");
      });
    });
    describe("row", () => {
      it("detect missing", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [{ name: "1", type: RawLog.CONFIG_TYPE }]
          });
        }).toThrow("missing required integer attribute 'row'");
      });
      it("detect invalid ", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [{ name: "1", type: RawLog.CONFIG_TYPE, row: "a" }]
          });
        }).toThrow("'row' must be an integer");
      });
    });
    describe("col", () => {
      it("detect missing", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [{ name: "1", type: RawLog.CONFIG_TYPE, row: 1 }]
          });
        }).toThrow("missing required integer attribute 'col'");
      });
      it("detect invalid ", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [{ name: "1", type: RawLog.CONFIG_TYPE, row: 1, col: "a" }]
          });
        }).toThrow("'col' must be an integer");
      });
    });
    describe("col", () => {
      it("detect missing", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [{ name: "1", type: RawLog.CONFIG_TYPE, row: 1 }]
          });
        }).toThrow("missing required integer attribute 'col'");
      });
      it("detect invalid ", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [{ name: "1", type: RawLog.CONFIG_TYPE, row: 1, col: "a" }]
          });
        }).toThrow("'col' must be an integer");
      });
    });
    describe("rowspan", () => {
      it("detect missing", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [{ name: "1", type: RawLog.CONFIG_TYPE, row: 1, col: 1 }]
          });
        }).toThrow("missing required integer attribute 'rowspan'");
      });
      it("detect invalid ", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [
              {
                name: "1",
                type: RawLog.CONFIG_TYPE,
                row: 1,
                col: 1,
                rowspan: "a"
              }
            ]
          });
        }).toThrow("'rowspan' must be an integer");
      });
    });
    describe("colspan", () => {
      it("detect missing", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [
              {
                name: "1",
                type: RawLog.CONFIG_TYPE,
                row: 1,
                col: 1,
                rowspan: 1
              }
            ]
          });
        }).toThrow("missing required integer attribute 'colspan'");
      });
      it("detect invalid ", () => {
        expect(() => {
          configChecker({
            source: "a",
            widgets: [
              {
                name: "colspan invalid",
                type: RawLog.CONFIG_TYPE,
                row: 1,
                col: 1,
                rowspan: 1,
                colspan: "a"
              }
            ]
          });
        }).toThrow("'colspan' must be an integer");
      });
    });
  });
});
