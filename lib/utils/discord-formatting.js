'use strict';

const bold = (s) => {
  return `**${s}**`;
};

const multilineCodeBlock = (s) => {
  return `\`\`\`${s}\`\`\``;
};

module.exports = {
  bold,
  multilineCodeBlock,
};
