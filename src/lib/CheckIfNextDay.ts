import { DateTime } from 'luxon';

export function checkIfNextDay(){
  const now = DateTime.now().setZone('Europe/Kyiv');
  const hour = now.hour;
  if(hour >= 15) return true
  else return false
}
