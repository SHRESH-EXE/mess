import { MealType, DayOfWeek } from '../types/mess';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getCurrentDayOfWeek(date: Date = new Date()): DayOfWeek {
  const index = date.getDay();
  return DAYS_OF_WEEK[index];
}

export interface ActiveMealStatus {
  currentMeal: MealType;
  status: 'ongoing' | 'upcoming' | 'closed';
  label: string;
  timeWindow: string;
  countdownText: string;
  nextMeal?: MealType;
}

export function getActiveMealStatus(date: Date = new Date()): ActiveMealStatus {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentTotalMins = hours * 60 + minutes;

  // Breakfast: 07:30 to 09:30 (450 to 570 mins)
  // Lunch: 12:30 to 14:30 (750 to 870 mins)
  // Snacks: 17:00 to 18:30 (1020 to 1110 mins)
  // Dinner: 19:30 to 22:00 (1170 to 1320 mins)

  if (currentTotalMins < 450) {
    const diff = 450 - currentTotalMins;
    const diffH = Math.floor(diff / 60);
    const diffM = diff % 60;
    return {
      currentMeal: 'breakfast',
      status: 'upcoming',
      label: 'Breakfast Starts Soon',
      timeWindow: '07:30 AM - 09:30 AM',
      countdownText: `Starts in ${diffH > 0 ? `${diffH}h ` : ''}${diffM}m`,
      nextMeal: 'breakfast'
    };
  } else if (currentTotalMins <= 570) {
    const left = 570 - currentTotalMins;
    return {
      currentMeal: 'breakfast',
      status: 'ongoing',
      label: 'Breakfast is LIVE now',
      timeWindow: '07:30 AM - 09:30 AM',
      countdownText: `Closes in ${Math.floor(left / 60)}h ${left % 60}m`,
      nextMeal: 'lunch'
    };
  } else if (currentTotalMins < 750) {
    const diff = 750 - currentTotalMins;
    const diffH = Math.floor(diff / 60);
    const diffM = diff % 60;
    return {
      currentMeal: 'lunch',
      status: 'upcoming',
      label: 'Lunch Window Opens Next',
      timeWindow: '12:30 PM - 02:30 PM',
      countdownText: `Opens in ${diffH > 0 ? `${diffH}h ` : ''}${diffM}m`,
      nextMeal: 'lunch'
    };
  } else if (currentTotalMins <= 870) {
    const left = 870 - currentTotalMins;
    return {
      currentMeal: 'lunch',
      status: 'ongoing',
      label: 'Lunch is LIVE now',
      timeWindow: '12:30 PM - 02:30 PM',
      countdownText: `Closes in ${Math.floor(left / 60)}h ${left % 60}m`,
      nextMeal: 'snacks'
    };
  } else if (currentTotalMins < 1020) {
    const diff = 1020 - currentTotalMins;
    const diffH = Math.floor(diff / 60);
    const diffM = diff % 60;
    return {
      currentMeal: 'snacks',
      status: 'upcoming',
      label: 'Evening High Tea Next',
      timeWindow: '05:00 PM - 06:30 PM',
      countdownText: `Opens in ${diffH > 0 ? `${diffH}h ` : ''}${diffM}m`,
      nextMeal: 'snacks'
    };
  } else if (currentTotalMins <= 1110) {
    const left = 1110 - currentTotalMins;
    return {
      currentMeal: 'snacks',
      status: 'ongoing',
      label: 'Snacks & Chai is LIVE now',
      timeWindow: '05:00 PM - 06:30 PM',
      countdownText: `Closes in ${Math.floor(left / 60)}h ${left % 60}m`,
      nextMeal: 'dinner'
    };
  } else if (currentTotalMins < 1170) {
    const diff = 1170 - currentTotalMins;
    const diffH = Math.floor(diff / 60);
    const diffM = diff % 60;
    return {
      currentMeal: 'dinner',
      status: 'upcoming',
      label: 'Dinner Window Opens Soon',
      timeWindow: '07:30 PM - 10:00 PM',
      countdownText: `Opens in ${diffH > 0 ? `${diffH}h ` : ''}${diffM}m`,
      nextMeal: 'dinner'
    };
  } else if (currentTotalMins <= 1320) {
    const left = 1320 - currentTotalMins;
    return {
      currentMeal: 'dinner',
      status: 'ongoing',
      label: 'Dinner is LIVE now',
      timeWindow: '07:30 PM - 10:00 PM',
      countdownText: `Closes in ${Math.floor(left / 60)}h ${left % 60}m`,
      nextMeal: 'breakfast'
    };
  } else {
    return {
      currentMeal: 'breakfast',
      status: 'closed',
      label: 'Mess Closed for Today',
      timeWindow: 'Reopens Tomorrow 07:30 AM',
      countdownText: 'Opens tomorrow at 07:30 AM',
      nextMeal: 'breakfast'
    };
  }
}

export function formatTimeAmPm(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDateFull(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getTodayDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
