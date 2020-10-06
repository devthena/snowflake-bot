const nodeHtmlToImage = require('node-html-to-image');
const botConfig = require('../../constants/botConfig');

/**
 * Generate an image buffer for a user profile card
 * @param {Object} stats 
 * @param {Number} rank 
 * @param {Message} message 
 */
const getProfileCard = async (stats, rank, message) => {

  const maxExp = stats.level * botConfig.LVL_MULTIPLIER;

  const profileCardBuffer = await nodeHtmlToImage({
    html: `<html>
      <head>
        <style>
        body {
          background: radial-gradient(#F9F9F9, #C6E2FF);
          border: 2px solid silver;
          color: #1B1B1B;
          display: flex;
          font-family: sans-serif;
          padding: 10px 15px;
          position: relative;
          width: 500px;
          height: 143px;
        }
        p {
          margin: 0;
        }
        .avatar {
          align-items: center;
          background: linear-gradient(to bottom left, #1B1B1B, white, #1B1B1B);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          width: 90px;
          height: 90px;
        }
        .avatar img {
          border-radius: 50%;
          width: 84px;
          height: 84px;
        }
        .rank {
          margin-top: 3px;
          text-align: center;
        }
        .rank h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }
        .rank p {
          font-size: 12px;
        }
        .info {
          padding-left: 20px;
          width: 100%;
        }
        .name {
          font-size: 18px;
          font-weight: 700;
        }
        .name span {
          font-size: 14px;
          font-weight: 300;
        }
        .membership {
          font-size: 12px;
        }
        .stats {
          padding: 15px 0 10px;
        }
        .gold, .star {
          display: flex;
          align-items: center;
          font-weight: 700;
        }
        .gold img,
        .star img {
          margin-right: 5px;
          width: 20px;
        }
        .star {
          margin-top: 5px;
        }
        .next-level {
          font-size: 12px;
          text-align: right;
        }
        .progress-bar {
          border: 1px solid #1B1B1B;
          background: white;
          border-radius: 5px;
          margin-top: 5px;
          width: 100%;
          height: 15px;
          overflow: hidden;
        }
        .progress-bar .bar {
          display: block;
          height: 100%;
          background: silver;
        }
        .level {
          position: absolute;
          top: 5px;
          right: 15px;
          text-align: center;
        }
        .level h1 {
          font-size: 36px;
          margin: 0;
        }
        .level p {
          font-size: 12px;
        }
        </style>
      </head>
      <body>
        <div class="profile">
          <div class="avatar">
            <img src="{{avatar}}" />
          </div>
          <div class="rank">
            <h1>{{rank}}</h3>
            <p>RANK</p>
          </div>
        </div>
        <div class="info">
          <p class="name">{{name}}<span>#{{discriminator}}</span></p>
          <p class="membership">MEMBER SINCE {{joinYear}}</p>
          <div class="stats">
            <div class="gold">
              <img src="https://discordapp.com/assets/11b9d8164d204c7fd48a88a515745c1d.svg" />
              <span>{{gold}}</span>
            </div>
            <div class="star">
              <img src="https://discordapp.com/assets/141d49436743034a59dec6bd5618675d.svg" />
              <span>{{stars}}</span>
            </div>
          </div>
          <div class="progress">
            <p class="next-level">{{exp}} / {{maxExp}} EXP</p>
            <div class="progress-bar">
              <span class="bar" style="width:{{progressWidth}};"></span>
            </div>
          </div>
        </div>
        <div class="level">
          <h1>{{level}}</h1>
          <p>LEVEL</p>
        </div>
      </body>
    </html>`,
    content: {
      avatar: message.author.displayAvatarURL(),
      discriminator: message.author.discriminator,
      exp: stats.exp,
      gold: stats.points,
      joinYear: message.member.joinedAt.getFullYear(),
      level: stats.level,
      maxExp: maxExp,
      name: message.author.username,
      progressWidth: stats.exp > 0 ? `${(stats.exp / maxExp) * 100}%` : '0',
      rank: rank,
      stars: stats.stars
    },
    puppeteerArgs: {
      args: ['--no-sandbox']
    }
  });

  return profileCardBuffer;
};

module.exports = getProfileCard;