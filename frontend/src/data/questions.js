export const QUESTIONS = [
  {
    id: 'weeknight_drinks',
    section: 'A',
    sectionLabel: 'The Reality',
    text: 'On a typical weeknight, how many drinks do you have?',
    type: 'single',
    options: [
      { value: '0-1', label: '0-1', sub: 'Rare or none' },
      { value: '2-3', label: '2-3', sub: 'A couple to unwind' },
      { value: '4-5', label: '4-5', sub: 'Enough to actually feel it' },
      { value: '6+', label: '6+', sub: 'More than I\'d say out loud' },
    ]
  },
  {
    id: 'weekend_drinks',
    section: 'A',
    sectionLabel: 'The Reality',
    text: 'On weekends?',
    type: 'single',
    options: [
      { value: 'same', label: 'About the same' },
      { value: 'more', label: 'More - it\'s the weekend' },
      { value: 'less', label: 'Less - I try to take a break' },
      { value: 'significantly-more', label: 'Significantly more' },
    ]
  },
  {
    id: 'last_dry_week',
    section: 'A',
    sectionLabel: 'The Reality',
    text: 'When did you have your last completely alcohol-free week?',
    type: 'single',
    options: [
      { value: 'recently', label: 'Recently', sub: 'Within the last month' },
      { value: 'few-months', label: 'A few months ago' },
      { value: 'over-year', label: 'Over a year ago' },
      { value: 'cant-remember', label: 'I honestly can\'t remember' },
      { value: 'never-tried', label: 'I\'ve never tried' },
    ]
  },
  {
    id: 'first_drink_time',
    section: 'A',
    sectionLabel: 'The Reality',
    text: 'The first drink of the day usually happens:',
    type: 'single',
    options: [
      { value: 'dinner', label: 'With dinner', sub: '6pm or later' },
      { value: 'early-evening', label: 'Earlier than I\'d like to admit', sub: '4 or 5pm' },
      { value: 'lunch', label: 'At lunch sometimes' },
      { value: 'before-noon', label: 'I look forward to it before noon' },
    ]
  },
  {
    id: 'cutback_ability',
    section: 'A',
    sectionLabel: 'The Reality',
    text: 'When you try to cut back, you:',
    type: 'single',
    options: [
      { value: 'easily', label: 'Can do it pretty easily' },
      { value: 'few-days', label: 'Make it a few days, then something happens' },
      { value: 'anxious', label: 'Feel anxious, irritable, or can\'t sleep well' },
      { value: 'never-succeeded', label: 'Have never successfully cut back for more than a week' },
    ]
  },
  {
    id: 'weight_change',
    section: 'B',
    sectionLabel: 'Your Body',
    text: 'Since your drinking increased, your weight has:',
    type: 'single',
    options: [
      { value: 'same', label: 'Stayed the same' },
      { value: 'up-10-20', label: 'Gone up 10-20 lbs' },
      { value: 'up-20+', label: 'Gone up 20+ lbs' },
      { value: 'fluctuated', label: 'Fluctuated a lot' },
    ]
  },
  {
    id: 'sleep_pattern',
    section: 'B',
    sectionLabel: 'Your Body',
    text: 'Your sleep:',
    type: 'single',
    options: [
      { value: 'fine', label: 'Fine - I sleep well' },
      { value: 'wake-at-2am', label: 'I fall asleep easily but wake up at 2-4am' },
      { value: 'always-tired', label: 'I feel tired no matter how long I sleep' },
      { value: 'rely-on-alcohol', label: 'I rely on alcohol to fall asleep' },
    ]
  },
  {
    id: 'physical_symptoms',
    section: 'B',
    sectionLabel: 'Your Body',
    text: 'In the last 6 months, have you experienced any of these?',
    subtext: 'Select all that apply',
    type: 'multi',
    options: [
      { value: 'heart-pounding', label: 'Heart pounding or racing at night' },
      { value: 'anxiety', label: 'Increased anxiety - sometimes out of nowhere' },
      { value: 'anger', label: 'Anger that feels bigger than the situation' },
      { value: 'brain-fog', label: 'Brain fog or difficulty concentrating at work' },
      { value: 'digestion', label: 'Acid reflux or digestive issues' },
      { value: 'low-libido', label: 'Lowered sex drive' },
      { value: 'appearance', label: 'Skin or appearance changes you\'ve noticed' },
      { value: 'blood-pressure', label: 'Blood pressure concerns' },
    ]
  },
  {
    id: 'partner_relationship',
    section: 'C',
    sectionLabel: 'Your Family',
    text: 'Your partner\'s relationship with your drinking:',
    type: 'single',
    options: [
      { value: 'doesnt-know', label: 'They don\'t know the full extent' },
      { value: 'mentioned-once', label: 'They\'ve mentioned it once or twice' },
      { value: 'recurring-conflict', label: 'It\'s become a recurring source of conflict' },
      { value: 'ultimatum', label: 'They\'ve issued an ultimatum or threatened to leave' },
      { value: 'dont-talk', label: 'We barely talk about it - or anything else' },
    ]
  },
  {
    id: 'kids_awareness',
    section: 'C',
    sectionLabel: 'Your Family',
    text: 'Your kids (if applicable):',
    type: 'single',
    options: [
      { value: 'too-young', label: 'Too young to notice' },
      { value: 'havent-noticed', label: 'I don\'t think they\'ve noticed' },
      { value: 'their-look', label: 'I\'ve caught them looking at me in a way that bothers me' },
      { value: 'said-something', label: 'They\'ve said something directly or indirectly' },
      { value: 'missed-moments', label: 'I\'ve missed things because of drinking' },
      { value: 'no-kids', label: 'I don\'t have kids' },
    ]
  },
  {
    id: 'evening_version',
    section: 'C',
    sectionLabel: 'Your Family',
    text: 'Is there a version of you at 7pm on a weekday that you wouldn\'t want your kids to see clearly?',
    type: 'single',
    options: [
      { value: 'no', label: 'No - I\'m in control' },
      { value: 'maybe', label: 'Maybe - I\'m not at my best' },
      { value: 'yes', label: 'Yes, and I know it' },
      { value: 'yes-scared', label: 'Yes, and it scares me' },
    ]
  },
  {
    id: 'two_versions_freq',
    section: 'D',
    sectionLabel: 'Your Identity',
    text: 'How often do you feel like there are two versions of you?',
    subtext: 'The one the world sees - and the one that pours another drink and hopes no one notices.',
    type: 'single',
    options: [
      { value: 'rarely', label: 'Rarely - I feel mostly consistent' },
      { value: 'sometimes', label: 'Sometimes - but I manage it' },
      { value: 'often', label: 'Often - it creates a low-level shame I carry' },
      { value: 'always', label: 'Almost always - and I\'m exhausted by it' },
    ]
  },
  {
    id: 'primary_drink_reason',
    section: 'D',
    sectionLabel: 'Your Identity',
    text: 'What\'s the primary reason you drink?',
    type: 'single',
    options: [
      { value: 'habit', label: 'Habit - it\'s just what I do after work' },
      { value: 'decompress', label: 'To decompress - it\'s the only thing that works' },
      { value: 'social', label: 'Social - it\'s part of my world' },
      { value: 'numb', label: 'To numb something I haven\'t dealt with' },
      { value: 'unsure', label: 'Honestly, I\'m not sure anymore' },
    ]
  },
  {
    id: 'afraid_of_losing',
    section: 'D',
    sectionLabel: 'Your Identity',
    text: 'If you\'re honest - what are you most afraid of losing?',
    type: 'single',
    options: [
      { value: 'health', label: 'My health' },
      { value: 'marriage', label: 'My marriage' },
      { value: 'kids', label: 'My relationship with my kids' },
      { value: 'identity', label: 'Who I am - my identity, my reputation' },
      { value: 'everything', label: 'All of it. Everything.' },
    ]
  },
  {
    id: 'weekly_spend',
    section: 'D',
    sectionLabel: 'Your Identity',
    text: 'Roughly how much do you spend on alcohol each week?',
    subtext: 'Used only to calculate your personal cost',
    type: 'single',
    options: [
      { value: '20', label: 'Under £20' },
      { value: '50', label: '£20-£50' },
      { value: '100', label: '£50-£100' },
      { value: '150', label: '£100-£150' },
      { value: '200', label: '£150+' },
    ]
  },
  {
    id: 'drug_use',
    section: 'E',
    sectionLabel: 'The Full Picture',
    text: 'Do you use any other substances alongside alcohol?',
    subtext: 'This helps us understand your full situation. Completely confidential.',
    type: 'single',
    options: [
      { value: 'none', label: 'No, just alcohol' },
      { value: 'cannabis', label: 'Cannabis occasionally' },
      { value: 'cannabis-regular', label: 'Cannabis regularly' },
      { value: 'cocaine', label: 'Cocaine socially or occasionally' },
      { value: 'cocaine-regular', label: 'Cocaine more than occasionally' },
      { value: 'prescription', label: 'Prescription medications (not as prescribed)' },
      { value: 'multiple', label: 'Multiple substances' },
      { value: 'prefer-not', label: 'Prefer not to say' },
    ]
  },
];
