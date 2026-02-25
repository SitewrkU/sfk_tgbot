import { DateTime } from 'luxon';
import type { BotContext } from '../../bot.js';
import { getNextDate } from './GetDate.js';

export async function checkIfNextDay(ctx: BotContext){
  const group = ctx.session.group;
  const nextDate = getNextDate();
  try {
    let data = await fetch(`https://tt.sclnau.com.ua/student/GetStudent.php?group=${group}&date=${nextDate}`)
      .then(r => r.json());
    
    if(!data.schedule){
      return false;
    }else{
      return true;
    }
  } catch (err) {
    return false;
  }
}
