const botActivities = require('../constants/botActivities');
const { POLL_RATE } = require('../constants/botConfig');

let timer = null;
let pointer = 0;

/**
 * Starts a timer for updating the bot activities
 * @param {Client} Bot 
 */
const startTimer = Bot => {

  if (pointer < botActivities.length) {
    Bot.user.setActivity(botActivities[pointer].name, { type: botActivities[pointer].type });
    pointer++;
    if (pointer >= botActivities.length) pointer = 0;
  }

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    startTimer(Bot);
  }, POLL_RATE);

};

module.exports = startTimer;