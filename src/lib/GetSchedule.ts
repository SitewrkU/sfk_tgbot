import type { group } from "console";
import type { BotContext } from "../../bot.js";
import { getCurrentDate, getNextDate } from "../lib/GetDate.js";

export async function getSchedule(ctx: BotContext, loadingMessageId: number, isNextDay: boolean, scheduleDate: string) {
  const group = ctx.session.group;
  const editLoading = (text: string) =>
    ctx.api.editMessageText(ctx.chat!.id, loadingMessageId, text);
 
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
    return
  }
      
  return data;
}