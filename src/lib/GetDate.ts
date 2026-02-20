import { DateTime } from 'luxon';

export function getCurrentDate(): string {
  const now = DateTime.now().setZone('Europe/Kyiv');
  return now.toFormat('dd.MM.yyyy');
}

export function getNextDate(): string {
  const tomorrow = DateTime.now()
    .setZone('Europe/Kyiv')
    .plus({ days: 1 });
  return tomorrow.toFormat('dd.MM.yyyy');
}