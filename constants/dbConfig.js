const config = {
  DEFAULT_VALUES: [false, true, true, true, false, false, '', '', '', '', '', '', 50],
  BACKUP_POLL_RATE: 1800000, // half hour
  CHANNELS: ['channel_alert_stream', 'channel_highlight_board', 'channel_highlight_ignore'],
  MODS: ['mod_alert_stream', 'mod_auto_add', 'mod_game_8ball', 'mod_game_gamble', 'mod_highlight_board', 'mod_optins'],
  ROLES: ['role_auto_add', 'role_moderator', 'role_optins'],
  SETTINGS: ['settings_gamble_percent']
};

module.exports = config;