document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const formContainer = document.getElementById('form-container');
  const evaluationContainer = document.getElementById('evaluation-container');
  const usernameInput = document.getElementById('username-input');
  const testerLevelInput = document.getElementById('testerlevel-input');
  const submitBtn = document.getElementById('submit-btn');
  const confettiBtn = document.getElementById('confetti-btn');

  let season0Data = [];
  let season1Data = [];

  // Fetch JSON data from public/ folder
  fetch('/top_2000_from_network.json')
    .then(res => res.json())
    .then(data => { season0Data = data; })
    .catch(err => console.error('Failed to load Season 0 data:', err));

  fetch('/season1_ss.json')
    .then(res => res.json())
    .then(data => { season1Data = data; })
    .catch(err => console.error('Failed to load Season 1 data:', err));

  // Confetti trigger function
  function launchConfetti() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }

  // Confetti button click
  confettiBtn.addEventListener('click', () => {
    launchConfetti();
  });

  // Achievement determination helpers
  function getSeason0Tag(mindshare) {
    if (mindshare > 0.2) return 'Top Yapper in Season 0';
    if (mindshare >= 0.1) return 'Well Known in Season 0';
    if (mindshare >= 0.02) return 'Underrated in Season 0';
    if (mindshare >= 0.01) return 'Tried Hard in Season 0';
    return 'Missed Season 0';
  }

  function getSeason1Tag(ms100) {
    if (ms100 > 0.2) return 'Yap God';
    if (ms100 >= 0.1) return 'Mad Mad Yapper';
    if (ms100 >= 0.05) return 'Mad Yapper';
    if (ms100 >= 0.01) return 'Underrated in Season 1';
    if (ms100 >= 0) return 'Trying Hard in Season 1';
    return 'Not a Yapper';
  }

  function getTesterTag(level) {
    if (level >= 9) return 'Finger Cramped by Testing';
    if (level === 10) return 'Lambo Soon';
    if (level >= 8) return 'Pre-Rich';
    if (level === 7) return 'The OGs';
    if (level >= 5) return 'Experienced Tester';
    return 'Emerging Tester';
  }

  function getContributionTier(s0Tag, s1Tag, testerTag) {
    const topS0 = s0Tag === 'Top Yapper in Season 0';
    const topS1 = s1Tag === 'Yap God';
    const topTester = testerTag === 'Lambo Soon' || testerTag === 'Finger Cramped by Testing';
    const topCount = [topS0, topS1, topTester].filter(Boolean).length;
    if (topCount === 3) return 'Union God';
    if (topCount >= 1) return "Union's Heart";
    return 'Union Core';
  }

  // Tip logic
  function getTip(tier, s0Tag, s1Tag, testerLevel) {
    if (tier === 'Union God') {
      return 'You don’t need a tip. Do what you do. Union runs in your veins.';
    }
    if (tier === "Union's Heart") {
      return 'Keep doing what you do. You’re on the path already. Stay active, help others, and aim for the top.';
    }
    // Lowest-tier beginner
    if (s0Tag === 'Missed Season 0' && s1Tag === 'Not a Yapper' && testerLevel <= 4) {
      return 'Start your journey today by joining the Union Community: app.union.build. This is just the beginning. Dive in and build your name.';
    }
    // Middle-tier
    return 'Stay consistent. Keep showing up, testing, and yapping. That’s how the greats are built.';
  }

  // General achievements
  const generalAchievements = [
    'ZK-Goblim',
    'Whale Shark',
    'Trustless User',
    'Interoperability Master'
  ];

  // On form submit
  submitBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const testerLevel = parseInt(testerLevelInput.value, 10);
    if (!username || !testerLevel) return;

    // Lookup season0
    const s0User = season0Data.find(u => u.username.toLowerCase() === username.toLowerCase());
    const s0mind = s0User ? parseFloat(s0User.mindshare) : 0;
    const isTeam = s0User && s0User.team;
    const s0Tag = getSeason0Tag(s0mind);

    // Lookup season1
    const s1User = season1Data.find(u => u.username.toLowerCase() === username.toLowerCase());
    const s1mindRaw = s1User ? parseFloat(s1User.mindshare) : 0;
    const s1mind = (s1mindRaw * 100).toFixed(3);
    const s1Tag = getSeason1Tag(parseFloat(s1mind));

    // Tester tag
    const testerTag = getTesterTag(testerLevel);

    // Contribution tier
    const contributionTier = getContributionTier(s0Tag, s1Tag, testerTag);

    // Determine central image
    let centralImg = 'image3';
    if (isTeam) centralImg = 'image4';
    else if (contributionTier === 'Union God') centralImg = 'image1';
    else if (contributionTier === "Union's Heart") centralImg = 'image2';

    // Assemble achievements
    const achievements = [];
    if (isTeam) {
      achievements.push('Union Team', 'Donated Everything');
    }
    achievements.push(contributionTier);
    achievements.push(...generalAchievements);

    // Badge hover texts
    const badgeInfo = [
      {
        src: 'badge1.png',
        title: `You have the ${s0Tag} & ${s1Tag} achievements and you are a force in the Yapper world. You set the rhythm, others follow.`
      },
      {
        src: 'badge2.png',
        title: `You have the ${testerTag} achievement. You’ve spent endless nights shipping, pushing transactions, and testing limits—your effort defines the grind.`
      },
      {
        src: 'badge3.png',
        title: `You are a core part of the Union journey. Your contribution goes beyond metrics. You're built different.`
      }
    ];

    // Render evaluation container
    evaluationContainer.innerHTML = `
      <h2>${username}</h2>
      <img src="${s0User?.pfp || 'default-pfp.png'}" alt="pfp" class="pfp" />
      <hr />
      <img src="${centralImg}.png" alt="central image" class="central-img" />
      <h3>Congratulations on Your Evaluation!!!</h3>
      <div class="stats">
        <p>Season 0 Mindshare: ${s0mind}%</p>
        <p>Season 1 Mindshare: ${s1mind}%</p>
        <p>Tester Rank: ${testerLevel}</p>
      </div>
      <hr />
      <div class="achievements">
        ${achievements.map(a => `<span class="achievement-tag">${a}</span>`).join('')}
      </div>
      <hr />
      <div class="badges">
        ${badgeInfo.map(b => `
          <div class="badge" title="${b.title}">
            <img src="${b.src}" alt="badge" />
          </div>
        `).join('')}
      </div>
      <hr />
      <div class="tip">${getTip(contributionTier, s0Tag, s1mind, testerLevel)}</div>
    `;

    // Toggle view
    formContainer.classList.add('hidden');
    evaluationContainer.classList.remove('hidden');

    // Launch confetti
    setTimeout(launchConfetti, 300);
  });
});
