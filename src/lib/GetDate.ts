import { DateTime } from 'luxon';

export function getCurrentDate(): string {
  const now = DateTime.now().setZone('Europe/Kyiv');
  return now.toFormat('dd.MM.yyyy');
}

export function getNextDate(): string {
  let nextDay = DateTime.now()
    .setZone('Europe/Kyiv')
    .plus({ days: 1 });

  while (nextDay.weekday === 6 || nextDay.weekday === 7) {
    nextDay = nextDay.plus({ days: 1 });
  }
  
  return nextDay.toFormat('dd.MM.yyyy');
}