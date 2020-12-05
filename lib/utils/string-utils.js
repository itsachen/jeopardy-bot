'use strict';

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const formatMoney = (value) => {
  const prefix = value < 0 ? '-$' : '$';

  value = Math.abs(value);

  const stringValue = value > 9999 ? value.toLocaleString('en-US') : value.toString();

  return `${prefix}${stringValue}`;
};

const formatMs = (value) => {
  if (value < 1000) {
    return `${value}ms!!`;
  } else {
    return `${(value / 1000).toFixed(2)}s`;
  }
};

module.exports = {
  capitalize,
  formatMoney,
  formatMs,
};
