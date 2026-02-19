import { fixTime } from "./FixPairTime.js";

interface PairStatus {
  pairNum: number;
  text: string;
}


export function getPairStatus(schedule: any[]): PairStatus | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];

    const fixedTime = fixTime(item.time, item.pairNumber);
    const [start, end] = fixedTime.split("-");
    
    const [startH, startM] = start!.split(":").map(Number);
    const [endH, endM] = end!.split(":").map(Number);
    
    const startMinutes = startH! * 60 + startM!;
    const endMinutes = endH! * 60 + endM!;
    
    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      const minutesLeft = endMinutes - currentMinutes;
      return {
        pairNum: item.pairNumber,
        text: `🟢 Пара іде (ще ${minutesLeft} хв)`
      };
    }

    if (currentMinutes >= startMinutes - 10 && currentMinutes < startMinutes) {
      const minutesUntil = startMinutes - currentMinutes;
      return {
        pairNum: item.pairNumber,
        text: `🟡 Пара починається через <u>${minutesUntil} хв</u>`
      };
    }

  }
  
  return null;
}