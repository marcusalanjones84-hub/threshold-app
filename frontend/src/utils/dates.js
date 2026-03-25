import { differenceInDays, format, parseISO, isToday, isYesterday, addDays } from 'date-fns';

export function getDaysSince(dateString) {
  if (!dateString) return 0;
  try {
    return differenceInDays(new Date(), parseISO(dateString));
  } catch {
    return 0;
  }
}

export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'dd MMM yyyy');
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString) {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd MMM');
  } catch {
    return dateString;
  }
}

export function getPlanDay(startDateString) {
  if (!startDateString) return 1;
  const days = differenceInDays(new Date(), parseISO(startDateString));
  return Math.max(1, days + 1);
}

export function getPlanWeek(startDateString) {
  const day = getPlanDay(startDateString);
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  if (day <= 30) return 4;
  return 5;
}

export function getMoneySaved(startDateString, weeklySpend) {
  if (!startDateString || !weeklySpend) return 0;
  const days = getDaysSince(startDateString);
  const dailySpend = weeklySpend / 7;
  return Math.round(days * dailySpend);
}

export function getCaloriesSaved(startDateString, drinksPerDay) {
  if (!startDateString || !drinksPerDay) return 0;
  const days = getDaysSince(startDateString);
  const caloriesPerDrink = 180;
  return days * drinksPerDay * caloriesPerDrink;
}

export function getTodayDateString() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDateString(date) {
  return format(date, 'yyyy-MM-dd');
}

export function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(getDateString(addDays(new Date(), -i)));
  }
  return days;
}

export function getLast30Days() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    days.push(getDateString(addDays(new Date(), -i)));
  }
  return days;
}

export const MILESTONES = {
  1: { title: 'Day One.', message: 'You started. Most men never do.' },
  3: { title: 'Day Three.', message: 'One of the hardest days. You got through it.' },
  7: { title: 'One Week.', message: 'Your liver has had 7 days to begin recovery. That\'s real.' },
  14: { title: 'Two Weeks.', message: 'Your brain is healing in ways you\'ll start to feel before you can name them.' },
  21: { title: 'Three Weeks.', message: 'Most men who reach 21 days reach 30. Keep going.' },
  30: { title: '30 Days.', message: 'You did what you said you\'d do. That\'s who you are now.' },
  60: { title: '60 Days.', message: 'This isn\'t a challenge anymore. This is your life.' },
  90: { title: '90 Days.', message: 'Three months. The identity shift is real and permanent.' },
};
