const botActivities = require('../constants/botActivities');
const botConfig = require('../constants/botConfig');
const backupMembers = require('./backupMembers');

let backupTimer = null;
let pointer = 0;

/**
 * Starts a timer for backing up server members data
 * @param {ClientUser} Bot 
 */
const startBackup = Bot => {

  if (pointer < botActivities.length) {
    Bot.user.setActivity(botActivities[pointer].name, { type: botActivities[pointer].type });
    pointer++;
    if (pointer >= botActivities.length) pointer = 0;
  }

  backupMembers(Bot);

  if (backupTimer) clearTimeout(backupTimer);
  backupTimer = setTimeout(() => {
    startBackup(Bot);
  }, botConfig.BACKUP_POLL_RATE);

};

module.exports = startBackup;