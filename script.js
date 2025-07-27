document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.getElementById('form-container');
  const evaluationContainer = document.getElementById('evaluation-container');
  const usernameInput = document.getElementById('username-input');
  const testerLevelInput = document.getElementById('testerlevel-input');
  const submitBtn = document.getElementById('submit-btn');
  const confettiBtn = document.getElementById('confetti-btn');

  let season0Data = [];
  let season1Data = [];

  fetch('/top_2000_from_network.json')
    .then(res => res.json())
    .then(data => { season0Data = data; });

  fetch('/season1_ss.json')
    .then(res => res.json())
    .then(data => { season1Data = data; });

  function launchConfetti() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }

  confettiBtn.addEventListener('click', launchConfetti);

  function getSeason0Achievements(ms) {
    const tags = [];
    if (ms < 0.00) return ['Missed Season 0'];
    if (ms >= 0.01) tags.push('Tried Hard in Season 0');
    if (ms >= 0.02) tags.push('Underrated in Season 0');
    if (ms >= 0.1) tags.push('Well Known in Season 0');
    if (ms > 0.2) tags.push('Top Yapper in Season 0');
    return tags;
  }

  function getSeason1Achievements(ms100) {
    const tags = [];
    if (ms100 < 0.000) return ['Not a Yapper'];
    if (ms100 >= 0) tags.push('Trying Hard in Season 1');
    if (ms100 >= 0.01) tags.push('Underrated in Season 1');
    if (ms100 >= 0.05) tags.push('Mad Yapper');
    if (ms100 >= 0.1) tags.push('Mad Mad Yapper');
    if (ms100 > 0.2) tags.push('Yap God');
    return tags;
  }

  function getTesterAchievements(level) {
    const tags = [];
    if (level >= 1 && level <= 4) tags.push('Emerging Tester');
    if (level >= 5 && level <= 6) tags.push('Experienced Tester');
    if (level === 7) tags.push('The OGs');
    if (level >= 8 && level <= 9) tags.push('Pre-Rich');
    if (level === 10) tags.push('Lambo Soon');
    if (level >= 9) tags.push('Finger Cramped by Testing');
    return tags;
  }

  function getLevelRank(level) {
    const ranks = {
      1: 'Conscript',
      2: 'Private First Class',
      3: 'Junior Sergeant',
      4: 'Sergeant',
      5: 'Senior Sergeant',
      6: 'Starshina',
      7: 'Junior Lieutenant',
      8: 'Lieutenant',
      9: 'Senior Lieutenant',
      10: 'Captain'
    };
    return ranks[level] || 'Unknown Rank';
  }

  function getContributionTier(s0, s1, tester) {
    const topS0 = s0.includes('Top Yapper in Season 0');
    const topS1 = s1.includes('Yap God');
    const topTester = tester.includes('Lambo Soon') || tester.includes('Finger Cramped by Testing');
    const count = [topS0, topS1, topTester].filter(Boolean).length;
    if (count === 3) return 'Union God';
    if (count >= 1) return "Union's Heart";
    return 'Union Core';
  }

  function getTip(tier, s0, s1, level) {
    if (tier === 'Union God') {
      return 'You don’t need a tip. Do what you do. Union runs in your veins.';
    }
    if (tier === "Union's Heart") {
      return 'Keep doing what you do. You’re on the path already. Stay active, help others, and aim for the top.';
    }
    if (s0.includes('Missed Season 0') && s1.includes('Not a Yapper') && level <= 4) {
      return 'Start your journey today by joining the Union Community: app.union.build. This is just the beginning. Dive in and build your name.';
    }
    return 'Stay consistent. Keep showing up, testing, and yapping. That’s how the greats are built.';
  }

  const generalAchievements = [
    'ZK-Goblim',
    'Whale Shark',
    'Trustless User',
    'Interoperability Master'
  ];

  submitBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const testerLevel = parseInt(testerLevelInput.value, 10);
    if (!username || isNaN(testerLevel)) return;

    const s0User = season0Data.find(u => u.username.toLowerCase() === username.toLowerCase());
    const s0mind = s0User ? parseFloat(s0User.mindshare) : 0;
    const s0team = s0User && s0User.team;
    const s0pfp = s0User && s0User.pfp;
    const s0Achievements = getSeason0Achievements(s0mind);

    const s1User = season1Data.find(u => u.username.toLowerCase() === username.toLowerCase());
    const s1mindRaw = s1User ? parseFloat(s1User.mindshare) : 0;
    const s1mind = (s1mindRaw * 100).toFixed(3);
    const s1Achievements = getSeason1Achievements(parseFloat(s1mind));

    const testerAchievements = getTesterAchievements(testerLevel);
    const levelRank = getLevelRank(testerLevel);

    const tier = getContributionTier(s0Achievements, s1Achievements, testerAchievements);
    const allAchievements = [];

    if (s0team) allAchievements.push('Union Team', 'Donated Everything');
    allAchievements.push(tier);
    allAchievements.push(...s0Achievements);
    allAchievements.push(...s1Achievements);
    allAchievements.push(...testerAchievements);
    allAchievements.push(levelRank + ' Rank');

    const insertAt = Math.floor(allAchievements.length / 2);
    allAchievements.splice(insertAt, 0, ...generalAchievements);

    let imageName = 'image3';
    if (s0team) imageName = 'image4';
    else if (tier === 'Union God') imageName = 'image1';
    else if (tier === "Union's Heart") imageName = 'image2';

    const badges = [
      {
        src: 'badge1.png',
        title: `You have the ${s0Achievements.at(-1) || 'None'} & ${s1Achievements.at(-1) || 'None'} achievements and you are a force in the Yapper world. You set the rhythm, others follow.`
      },
      {
        src: 'badge2.png',
        title: `You have the ${testerAchievements.at(-1) || 'None'} achievement. You’ve spent endless nights shipping, pushing transactions, and testing limits—your effort defines the grind.`
      },
      {
        src: 'badge3.png',
        title: `You are a core part of the Union journey. Your contribution goes beyond metrics. You're built different.`
      }
    ];

    evaluationContainer.innerHTML = `
      <div class="user-header">
        <img src="${s0pfp || 'default-pfp.png'}" alt="pfp" class="pfp" />
        <h2>${username}</h2>
      </div>
      <hr />
      <img src="${imageName}.png" alt="central" class="central-img" />
      <h3>Congratulations on Your Evaluation!!!</h3>
      <div class="stats">
        <p>Season 0 Mindshare: ${s0mind}%</p>
        <p>Season 1 Mindshare: ${s1mind}%</p>
        <p>Tester Rank: ${testerLevel}</p>
      </div>
      <hr />
      <div class="achievements">
        ${allAchievements.map(tag => `<span class="achievement-tag">${tag}</span>`).join('')}
      </div>
      <hr />
      <div class="badges">
        ${badges.map(b => `
          <div class="badge" title="${b.title}">
            <img src="${b.src}" alt="badge" />
          </div>
        `).join('')}
      </div>
      <hr />
      <div class="tip">${getTip(tier, s0Achievements, s1Achievements, testerLevel)}</div>
    `;

    formContainer.classList.add('hidden');
    evaluationContainer.classList.remove('hidden');
    setTimeout(launchConfetti, 300);
  });
});
