export function calculateResult(answers) {
  let score = 0;
  
  // Weeknight drinking
  const wn = answers.weeknight_drinks;
  if (wn === '2-3') score += 5;
  if (wn === '4-5') score += 15;
  if (wn === '6+') score += 25;
  
  // Last dry week
  const ldw = answers.last_dry_week;
  if (ldw === 'few-months') score += 5;
  if (ldw === 'over-year') score += 10;
  if (ldw === 'cant-remember') score += 15;
  if (ldw === 'never-tried') score += 15;
  
  // Cutback ability
  const ca = answers.cutback_ability;
  if (ca === 'few-days') score += 8;
  if (ca === 'anxious') score += 15;
  if (ca === 'never-succeeded') score += 20;
  
  // Sleep
  const sp = answers.sleep_pattern;
  if (sp === 'wake-at-2am') score += 8;
  if (sp === 'always-tired') score += 12;
  if (sp === 'rely-on-alcohol') score += 20;
  
  // Partner relationship
  const pr = answers.partner_relationship;
  if (pr === 'mentioned-once') score += 5;
  if (pr === 'recurring-conflict') score += 12;
  if (pr === 'ultimatum') score += 20;
  if (pr === 'dont-talk') score += 15;
  
  // Evening version
  const ev = answers.evening_version;
  if (ev === 'maybe') score += 5;
  if (ev === 'yes') score += 10;
  if (ev === 'yes-scared') score += 15;
  
  // Two versions
  const tv = answers.two_versions_freq;
  if (tv === 'sometimes') score += 5;
  if (tv === 'often') score += 10;
  if (tv === 'always') score += 15;
  
  // Primary reason
  const pd = answers.primary_drink_reason;
  if (pd === 'numb') score += 15;
  if (pd === 'decompress') score += 8;
  if (pd === 'unsure') score += 10;
  
  // Physical symptoms
  const symptoms = answers.physical_symptoms || [];
  score += symptoms.length * 3;
  
  // Drug use - additional risk factor
  const du = answers.drug_use;
  if (du === 'cannabis') score += 3;
  if (du === 'cannabis-regular') score += 8;
  if (du === 'cocaine') score += 12;
  if (du === 'cocaine-regular') score += 20;
  if (du === 'prescription') score += 10;
  if (du === 'multiple') score += 25;
  
  // Determine profile
  let profile;
  if (score < 35) profile = 'warning';
  else if (score < 70) profile = 'middle';
  else profile = 'moment';
  
  return { profile, score };
}

export const PROFILE_CONTENT = {
  warning: {
    headline: 'The Warning Signs Are Clear.',
    colour: 'text-[#D4A017]',
    opening: [
      'You\'re not in crisis yet.',
      'But you\'re closer to the edge than you\'re admitting.',
    ],
    body: [
      'The patterns you described - drinking most nights, disrupted sleep, a little more irritability than you\'d like - these don\'t happen in isolation.',
      'They build.',
      'What you have right now is a window.',
      'Most men who end up in serious trouble all say the same thing: "I wish I\'d listened when the signs were smaller."',
      'You\'re listening now.',
      'That matters.',
    ]
  },
  middle: {
    headline: 'You\'re In The Middle Of It.',
    colour: 'text-[#D4A017]',
    opening: [
      'Let\'s be direct with each other.',
      'What you described isn\'t "drinking to unwind."',
      'It\'s drinking to function.',
    ],
    body: [
      'Drinking to not feel what you\'d feel without it.',
      'And somewhere - in the 3am wake-ups, in the way your wife looks at you, in the moments with your kids you can\'t quite get back - you know that.',
      'You\'re not broken. You\'re not weak.',
      'You\'re a man who found a coping mechanism that worked until it didn\'t.',
      'And now it\'s working against everything you\'ve built.',
      'The question isn\'t whether this is a problem.',
      'The question is: what do you want to do about it while you still have a choice?',
    ]
  },
  moment: {
    headline: 'This Is The Moment.',
    colour: 'text-[#FF453A]',
    opening: [
      'You answered this honestly.',
      'That took something.',
    ],
    body: [
      'What you\'ve described is a man at a crossroads - not in five years, not "if things get worse."',
      'Now.',
      'Your body is telling you. Your marriage is telling you. That part of you that opened this app is telling you.',
      'You don\'t need a label. You don\'t need to hit a lower bottom.',
      'You need to decide - right now, in this moment - who you are and what you\'re willing to do to keep what matters.',
      'This isn\'t about alcohol.',
      'It\'s about you. The real you. The one who built everything worth protecting.',
    ]
  }
};

export function getWeeklySpend(value) {
  const spendMap = {
    '20': 20,
    '50': 50,
    '100': 100,
    '150': 150,
    '200': 200,
  };
  return spendMap[value] || 50;
}

export function getDrinksPerDay(weeknightDrinks, weekendDrinks) {
  const weeknightMap = {
    '0-1': 0.5,
    '2-3': 2.5,
    '4-5': 4.5,
    '6+': 7,
  };
  
  const weeknightAvg = weeknightMap[weeknightDrinks] || 2;
  let weekendMultiplier = 1;
  
  if (weekendDrinks === 'more') weekendMultiplier = 1.5;
  if (weekendDrinks === 'significantly-more') weekendMultiplier = 2;
  if (weekendDrinks === 'less') weekendMultiplier = 0.7;
  
  const weekendAvg = weeknightAvg * weekendMultiplier;
  
  // Weighted average: 5 weeknights + 2 weekend days
  return Math.round(((weeknightAvg * 5) + (weekendAvg * 2)) / 7 * 10) / 10;
}
