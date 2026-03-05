import type { BotContext } from "../../../bot.js";
import { getCurrentDate, getNextDate } from "../../lib/GetDate.js";
import { checkIfNextDay } from "../../lib/CheckIfNextDay.js";
import { fixTime } from "../../lib/FixPairTime.js";
import { getPairStatus } from "../../lib/GetPairStatus.js";
import { scheduleButtons } from "../ScheduleButtons.js";
import { getSchedule as fetchSchedule } from "../../lib/GetSchedule.js";

export async function getSchedule(ctx: BotContext) {
  const isNextDay = await checkIfNextDay(ctx);
  const group = ctx.session.group;

  if (!group) {
    await ctx.reply('❌ Схоже ви не встановили свою групу. Перевірте налаштування та встановіть групу для отримання розкладу. Або нажміть тут: /setgroup');
    return;
  }
  
  const loadingMsg = await ctx.reply(`🔃 Отримання даних...`);
  
  const editLoading = (text: string) =>
    ctx.api.editMessageText(ctx.chat!.id, loadingMsg.message_id, text);
  
  try {
    let scheduleDate = isNextDay ? getNextDate() : getCurrentDate();
    // Отримання розкладу
    const data = await fetchSchedule(ctx, loadingMsg.message_id, isNextDay, scheduleDate);

    // Виведення результату
    await editLoading(`✅ Розклад на <u><b>${scheduleDate}</b></u> (${scheduleDate === getCurrentDate() ? 'Сьогодні' : 'Завтра'}).\nГрупа: ${group}`);
    
    const pairStatus = !isNextDay ? getPairStatus(data.schedule) : null;
    let scheduleResult: string = '';
    
    for (const item of data.schedule) {
      const time = fixTime(item.time, item.pairNumber);
      const isCurrentPair = pairStatus?.pairNum === item.pairNumber;
      const pairStatusText = isCurrentPair ? pairStatus!.text : '';

      const header = `¦ ${item.pairNumber} ¦ <b>${item.subject}</b>`
      const status = pairStatusText ? ` | ${pairStatusText}` : '';
      let details = `\nАуд.: <b>${item.room}</b> | 🕑 <b>${time}</b>`
      if(item.teacher === 'Лесько М.М.'){
        details += `\n❗☢☠ <b>${item.teacher}</b> ☠☢❗`;
      }
      if(item.teacher === 'Пошивак М.В.'){
        details += `\n<a href="https://www.tiktok.com/@pythonblyat5/video/7347374025221393696?is_from_webapp=1&sender_device=pc&web_id=7610816937761900050">Пошивак М.В. 😮‍💨</a>`;
      }

      scheduleResult += `${header}${status}${details}\n\n`;
    }
    
    await ctx.reply(scheduleResult, { reply_markup: scheduleButtons, parse_mode: 'HTML' });


    }catch (err) {
      try {
        await editLoading('❌ Не вдалося отримати дані');
        console.error('Помилка при отриманні розкладу:', err);
      } catch {
        //Ігнор помилки
      }
    }
}
