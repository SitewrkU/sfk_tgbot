import type { BotContext } from "../../../bot.js";
import { getCurrentDate, getNextDate } from "../../lib/GetDate.js";
import { checkIfNextDay } from "../../lib/CheckIfNextDay.js";
import { fixTime } from "../../lib/FixPairTime.js";
import { getPairStatus } from "../../lib/GetPairStatus.js";

export async function getSchedule(ctx: BotContext) {
  const isNextDay = checkIfNextDay();
  const group = ctx.session.group;

  if (!group) {
    await ctx.reply('❌ Схоже ви не встановили свою групу. Перевірте налаштування та встановіть групу для отримання розкладу.');
    return;
  }
  
  const loadingMsg = await ctx.reply(`🔃 Отримання даних...`);
  
  const editLoading = (text: string) =>
    ctx.api.editMessageText(ctx.chat!.id, loadingMsg.message_id, text);
  
  try {
    // Визначення який розклад потрібно отримати, та отримання
    let scheduleDate = isNextDay ? getNextDate() : getCurrentDate();
      
    let data = await fetch(`https://tt.sclnau.com.ua/student/GetStudent.php?group=${group}&date=${scheduleDate}`)
      .then(r => r.json());

    const hasSchedule = data.schedule && 
      Array.isArray(data.schedule) && 
      data.schedule.length > 0;
    

    // Перевірки, якщо розклад не вдалося отримати
    if (!hasSchedule && isNextDay) {
      await editLoading('⚠️ Розклад на завтра відсутній. Спроба повернути сьогоднішній...');
      scheduleDate = getCurrentDate();
      data = await fetch(`https://tt.sclnau.com.ua/student/GetStudent.php?group=${group}&date=${scheduleDate}`)
        .then(r => r.json());
    }
    const finalHasSchedule = data.schedule && 
      Array.isArray(data.schedule) && 
      data.schedule.length > 0;
    

    if (!finalHasSchedule) {
      await editLoading('❌ Розклад відсутній на обидва дні.');
      return;
    }
    

    // Виведення результату

    await editLoading(`✅ Розклад на <u><b>${scheduleDate}</b></u> (${scheduleDate === getCurrentDate() ? 'Сьогодні' : 'Завтра'}).\nГрупа: ${group}`);
    
    const pairStatus = getPairStatus(data.schedule);
    let scheduleResult: string = '';
    
    for (const item of data.schedule) {
      const time = fixTime(item.time, item.pairNumber);
      const isCurrentPair = pairStatus?.pairNum === item.pairNumber;
      const pairStatusText = isCurrentPair ? pairStatus!.text : '';
      scheduleResult += `[${item.pairNumber}] <b>${item.subject}</b> ${pairStatusText ? ' | ' + pairStatusText : ''}\nАудиторія: <b>${item.room}</b> | 🕑 <b>${time}</b>` + "\n\n";
    }
    
    await ctx.reply(scheduleResult, { parse_mode: 'HTML' });

    }catch (err) {
      try {
        await editLoading('❌ Не вдалося отримати дані');
      } catch {
        //Ігнор помилки
      }
    }
}
