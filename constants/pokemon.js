const cooldowns = {
  BAG: 20000,
  DEX: 20000,
  EXPLORE: 25000
};

const eveningHour = 18;
const morningHour = 6;

const rarity = {
  C: 'Common',
  U: 'Uncommon',
  R: 'Rare',
  V: 'Very Rare',
  L: 'Legendary',
  M: 'Mythical'
};

const reacts = {
  CANCEL: 'negative_squared_cross_mark',
  CONFIRM: 'white_check_mark',
  EXPAND: 'left_right_arrow',
  GREATBALL: 'greatball',
  MASTERBALL: 'masterball',
  POKEBALL: 'pokeball',
  ULTRABALL: 'ultraball'
};

const reactUnicodes = {
  CANCEL: '❎',
  CONFIRM: '✅',
  EXPAND: '↔'
};

const spriteIconUrl = 'https://img.pokemondb.net/sprites/sword-shield/icon/';
const validBalls = ['pokeball', 'greatball', 'ultraball', 'masterball'];

const weightedRarity = {
  C: 0.3448, // x10
  U: 0.2759, // x8
  R: 0.2069, // x6
  V: 0.1379, // x4
  L: 0.0345
};

const aikoExclusives = [
  '004', '006', '054', '063', '093', '094', '134', '143', '144', '150',
  '162', '175', '182', '183', '199', '212', '216', '242', '249', '251',
  '281', '298', '300', '312', '315', '327', '358', '384', '385'
];
const athenaExclusives = [
  '001', '009', '037', '040', '079', '113', '123', '136', '148', '151',
  '155', '164', '172', '194', '197', '215', '226', '231', '243', '250',
  '258', '282', '296', '311', '325', '351', '353', '363', '380', '383'
];

const serverExclusives = {
  [process.env.AIKO_SERVER_ID]: aikoExclusives,
  [process.env.ATHENA_SERVER_ID]: athenaExclusives
}

module.exports = {
  COOLDOWNS: cooldowns,
  EVENING_HOUR: eveningHour,
  EXCLUSIVES: serverExclusives,
  ICON_URL: spriteIconUrl,
  MORNING_HOUR: morningHour,
  RARITY: rarity,
  REACTS: reacts,
  REACT_UNI: reactUnicodes,
  VALID_BALLS: validBalls,
  WEIGHTED_RARITY: weightedRarity
};