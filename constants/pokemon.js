const ballBonus = {
  pokeball: 1,
  greatball: 1.5,
  ultraball: 2
};

const cooldowns = {
  BAG: 20000,
  DEX: 20000,
  EXPLORE: 30000
};

const dexPageLimit = 10;
const eveningHour = 18;
const morningHour = 6;

const gender = {
  female: 'Female',
  male: 'Male'
};

const limitIncreases = {
  BAG: 3,
  DEX: 1
};

const expandCosts = {
  BAG: 1500,
  DEX: 1250
};

const shopPrices = {
  pokeball: 200,
  greatball: 600,
  ultraball: 1200,
  masterball: 10000
};

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
  EXPAND: '↔',
  HASH: '#⃣',
  NEXT: '▶',
  PREV: '◀'
};

const shopIconUrl = 'https://cdn.discordapp.com/attachments/798738516632535060/798738596957913118/mart.png';
const spriteIconUrl = 'https://img.pokemondb.net/sprites/sword-shield/icon/';
const validEmojis = ['pokeball', 'greatball', 'ultraball', 'masterball'];

const ui = {
  LINE: '-----------------------------------'
};

const variations = {
  alola: 'Alolan',
  attack: 'Attack',
  b: 'B',
  bug: 'Bug',
  c: 'C',
  d: 'D',
  dark: 'Dark',
  defense: 'Defense',
  dragon: 'Dragon',
  e: 'E',
  electric: 'Electric',
  em: '!',
  f: 'F',
  fairy: 'Fairy',
  fan: 'Fan',
  fighting: 'Fighting',
  fire: 'Fire',
  flying: 'Flying',
  frost: 'Frost',
  g: 'G',
  ghost: 'Ghost',
  grass: 'Grass',
  ground: 'Ground',
  h: 'H',
  heat: 'Heat',
  i: 'I',
  ice: 'Ice',
  j: 'J',
  k: 'K',
  l: 'L',
  m: 'M',
  mow: 'Mow',
  n: 'N',
  o: 'O',
  origin: 'Origin',
  p: 'P',
  poison: 'Poison',
  primal: 'Primal',
  psychic: 'Psychic',
  q: 'Q',
  qm: '?',
  r: 'R',
  rainy: 'Rainy',
  rock: 'Rock',
  s: 'S',
  sandy: 'Sandy',
  sky: 'Sky',
  snowy: 'Snowy',
  speed: 'Speed',
  steel: 'Steel',
  sunny: 'Sunny',
  sunshine: 'Sunshine',
  t: 'T',
  trash: 'Trash',
  u: 'U',
  v: 'V',
  w: 'W',
  wash: 'Wash',
  water: 'Water',
  x: 'X',
  y: 'Y',
  z: 'Z'
};

const weightedRarity = {
  C: 0.3448, // x10
  U: 0.2759, // x8
  R: 0.2069, // x6
  V: 0.1379, // x4
  L: 0.0345
};

const aikoExclusives = [
  '004', '006', '054', '063', '093', '094', '134', '143', '144', '150',
  '162', '175', '182', '183', '196', '199', '212', '216', '242', '249', '251',
  '281', '298', '300', '312', '315', '327', '358', '384', '385'
];
const athenaExclusives = [
  '001', '009', '037', '040', '079', '113', '123', '136', '148', '151',
  '155', '164', '172', '194', '197', '215', '226', '231', '243', '250',
  '258', '282', '296', '311', '325', '301', '353', '363', '380', '383'
];

const serverExclusives = {
  [process.env.AIKO_SERVER_ID]: aikoExclusives,
  [process.env.ATHENA_SERVER_ID]: athenaExclusives
}

module.exports = {
  BALL_BONUS: ballBonus,
  COOLDOWNS: cooldowns,
  EVENING_HOUR: eveningHour,
  EXCLUSIVES: serverExclusives,
  EXPAND_COSTS: expandCosts,
  GENDER: gender,
  ICON_URL: spriteIconUrl,
  LIMIT_INC: limitIncreases,
  MORNING_HOUR: morningHour,
  PAGE_LIMIT: dexPageLimit,
  RARITY: rarity,
  REACTS: reacts,
  REACTS_UNI: reactUnicodes,
  SHOP_ICON_URL: shopIconUrl,
  SHOP_PRICES: shopPrices,
  UI: ui,
  VALID_EMOJIS: validEmojis,
  VARIATIONS: variations,
  WEIGHTED_RARITY: weightedRarity
};