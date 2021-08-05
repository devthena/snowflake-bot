const PINK = require('./botConfig').COLOR;
const colors = require('./discordColors');

const status = {
  'ban': colors.RED,
  'default': PINK,
  'delete': colors.RED,
  'join': colors.GREEN,
  'leave': colors.YELLOW,
  'reset': colors.BLUE
};

module.exports = status;