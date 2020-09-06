/**
 * Add the command data to the Bot object
 * @param {ClientUser} Bot
 * @param {String} command 
 */
const loadCommand = (Bot, command) => {
  try {
    const comm = require(`./../commands/${command}`);
    Bot.logger.info(`[SYS] Loading command: ${comm.info.name}`);
    Bot.commands.set(comm.info.name, comm);
    comm.conf.aliases.forEach(alias => {
      Bot.aliases.set(alias, comm.info.name);
    });
    return false;
  } catch (e) {
    Bot.logger.error(`[SYS] Error loading command ${command}: ${e}`);
  }
};

module.exports = loadCommand;