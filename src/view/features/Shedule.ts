import { Context } from "grammy";
import { getCurrentDate, getNextDate } from "../../lib/GetDate.js";
import { checkIfNextDay } from "../../lib/CheckIfNextDay.js";
import { fixTime } from "../../lib/FixPairTime.js";
import { getPairStatus } from "../../lib/GetPairStatus.js";

export async function getSchedule(ctx: Context) {
  const isNextDay = checkIfNextDay();
  const group = 'К-11';
  
  const loadingMsg = await ctx.reply(`🔃 Отримання даних...`);
  
  const editLoading = (text: string) =>
    ctx.api.editMessageText(ctx.chat!.id, loadingMsg.message_id, text);
  
  try {
    // Визначення який розклад потрібно отримати, та перевірки
    let date = isNextDay ? getNextDate() : getCurrentDate();
      
    let data = await fetch(`https://tt.sclnau.com.ua/student/GetStudent.php?group=${group}&date=${date}`)
      .then(r => r.json());
    
    if ((!data.schedule || data.schedule.length === 0) && isNextDay) {
      await editLoading('⚠️ Розклад на завтра відсутній. Спроба повернути сьогоднішній...');
      date = getCurrentDate();
      data = await fetch(`https://tt.sclnau.com.ua/student/GetStudent.php?group=${group}&date=${date}`)
        .then(r => r.json());
    }
    
    if (!data.schedule || data.schedule.length === 0) {
      await editLoading('❌ Розклад відсутній на обидва дні.');
      return;
    }
    
    // Виведення результату

    const schedule = data.schedule.map((item: { name: any; }) => item);
    await editLoading(`✅ Розклад на <u><b>${date}</b></u> (${date === getCurrentDate() ? 'Сьогодні' : 'Завтра'}).\nГрупа: ${group}`);
    
    const pairStatus = getPairStatus(schedule);
    let scheduleResult: string = '';
    
    for (const item of schedule) {
      const time = fixTime(item.time, item.pairNumber);
      const isCurrentPair = pairStatus?.pairNum === item.pairNumber;
      const pairStatusText = isCurrentPair ? pairStatus!.text : '';
      scheduleResult += `[${item.pairNumber}] <b>${item.subject}</b> ${pairStatusText ? ' | ' + pairStatusText : ''}\nАудиторія: <b>${item.room}</b> | 🕑 <b>${time}</b>` + "\n\n";
    }
    
    await ctx.reply(scheduleResult, { parse_mode: 'HTML' });


  } catch (err) {
    
    await ctx.api.editMessageText(
      ctx.chat!.id,
      loadingMsg.message_id,
      '❌ Не вдалося отримати дані'
    );
    console.log(err);
  }
}
