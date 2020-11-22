const nodeHtmlToImage = require('node-html-to-image');
const botConfig = require('../../constants/botConfig');
const monthMap = require('../../constants/monthMap');

/**
 * Generate an image buffer for a user profile card
 * @param {Object} stats 
 * @param {Number} rank 
 * @param {GuildMember} member
 */
const getProfileCard = async (stats, rank, member) => {

  const maxExp = stats.level * botConfig.LVL_MULTIPLIER;

  const profileCardBuffer = await nodeHtmlToImage({
    html: `<html>
      <head>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        body {
          background: linear-gradient(#F9F9F9, {{roleHexColor}} 35%);
          border: 2px solid silver;
          color: #1B1B1B;
          display: flex;
          font-family: 'Poppins', sans-serif;
          padding: 10px 15px;
          position: relative;
          width: 500px;
          height: 145px;
        }
        p {
          margin: 0;
        }
        .avatar {
          align-items: center;
          background: linear-gradient(to bottom left, #1B1B1B, #FFFFFF, #1B1B1B);
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
          text-align: center;
        }
        .rank h1 {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }
        .rank p {
          font-size: 12px;
          margin-top: -5px;
        }
        .info {
          padding-left: 20px;
          width: 100%;
        }
        .name {
          font-size: 24px;
          font-weight: 600;
        }
        .name span {
          font-size: 16px;
          font-weight: 400;
        }
        .membership {
          font-size: 12px;
          margin-top: -5px;
        }
        .stats {
          padding: 10px 0 0;
        }
        .gold, .star {
          display: flex;
          align-items: center;
          font-weight: 600;
        }
        .gold img,
        .star img {
          margin-right: 5px;
          width: 20px;
        }
        .star {
          margin-top: 2px;
        }
        .next-level {
          font-size: 12px;
          text-align: right;
        }
        .progress-bar {
          border: 1px solid #1B1B1B;
          background: #FFFFFF;
          border-radius: 8px;
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
          top: 0;
          right: 15px;
          text-align: center;
        }
        .level h1 {
          font-size: 36px;
          margin: 0;
        }
        .level p {
          font-size: 12px;
          margin-top: -8px;
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
          <p class="membership">MEMBER SINCE {{joinMonth}} {{joinYear}}</p>
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
      avatar: member.user.displayAvatarURL(),
      discriminator: member.user.discriminator,
      exp: stats.exp,
      gold: stats.points,
      joinMonth: monthMap[member.joinedAt.getMonth()],
      joinYear: member.joinedAt.getFullYear(),
      level: stats.level,
      maxExp: maxExp,
      name: member.user.username,
      progressWidth: stats.exp > 0 ? `${(stats.exp / maxExp) * 100}%` : '0',
      rank: rank,
      roleHexColor: member.displayHexColor,
      stars: stats.stars
    },
    puppeteerArgs: {
      args: ['--no-sandbox']
    }
  });

  return profileCardBuffer;
};

module.exports = getProfileCard;