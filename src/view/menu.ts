import { Menu } from "@grammyjs/menu";
import { getCurrentDate, getNextDate } from "../lib/GetDate.js";
import { checkIfNextDay } from "../lib/CheckIfNextDay.js";
import { fixTime } from "../lib/FixPairTime.js";
import { type EditOrReplyFlavor, editOrReplyMiddleware } from "grammy-edit-or-reply";

export const mainMenu = new Menu('main-menu')
  .text("Розклад", async (ctx) => {
    const isNextDay = checkIfNextDay()
    

    const loadingMsg = await ctx.reply(`🔃 Отримання даних...`);
    const editLoading = (text: string) =>
      ctx.api.editMessageText(ctx.chat!.id, loadingMsg.message_id, text);

    try {
      let date = isNextDay ? getNextDate() : getCurrentDate();
      let data = await fetch(`https://tt.sclnau.com.ua/student/GetStudent.php?group=%D0%9A-11&date=${date}`)
        .then(r => r.json());

      if((!data.schedule || data.schedule.length === 0) && isNextDay){
        await editLoading('⚠️ Розклад на завтра відсутній. Спроба поверути сьогоднішній...')
        date = getCurrentDate();
        data = await fetch(`https://tt.sclnau.com.ua/student/GetStudent.php?group=%D0%9A-11&date=${date}`)
          .then(r => r.json());
      }

      if (!data.schedule || data.schedule.length === 0) {
        await editLoading('❌ Розклад відсутній на обидва дні.');
        return;
      }

      const schedule = data.schedule.map((item: { name: any; }) => item); 
      await editLoading(`✅ Розклад на <u><b>${date}</b></u>`)

      let scheduleResult: string = "";
      for(const item of schedule){
        scheduleResult += `[${item.pairNumber}] ${item.subject}\nАудиторія: <u><b>${item.room}</b></u> | 🕑 <b>${fixTime(item.time, item.pairNumber)}</b>` + "\n\n";
      }


      ctx.reply(scheduleResult);

    } catch (err) {
      await ctx.api.editMessageText(
        ctx.chat!.id,
        loadingMsg.message_id,
        '❌ Не вдалося отримати дані'
      );
      console.log(err)
    }
  })

  .text("Пара зараз", async (ctx) => {
    await ctx.reply('Зараз пара');
  })
  .row()
  .text("Налаштування", async (ctx) => {
    await ctx.reply('Налаштування');
  })
