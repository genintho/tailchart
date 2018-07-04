const calculateScreenSize = require("../calculateScreenSize");

describe("utils/calculateScreenSize", () => {
  it("find biggest number", () => {
    expect(
      calculateScreenSize({
        widgets: [
          {
            col: 27,
            colspan: 1,
            row: 0,
            rowspan: 2
          },
          {
            col: 12,
            colspan: 1,
            row: 1,
            rowspan: 2
          }
        ]
      })
    ).toEqual({
      rows: 2,
      cols: 28
    });
  });
});
