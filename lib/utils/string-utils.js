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

module.exports = {
  capitalize,
  formatMoney,
};
