module.exports = config => {
  const cols = config.widgets.reduce((accumulator, current) => {
    if (!accumulator) {
      accumulator = 0;
    }
    return Math.max(accumulator, current.col + 1);
  }, 0);

  const rows = config.widgets.reduce((accumulator, current) => {
    if (!accumulator) {
      accumulator = 0;
    }
    return Math.max(accumulator, current.row + 1);
  }, 0);
  return { cols, rows };
};
