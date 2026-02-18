import { Menu } from "@grammyjs/menu";
import { getCurrentDate } from "../lib/GetDate.js";

export const mainMenu = new Menu('main-menu')
  .text("Розклад", async (ctx) => {
    const date = getCurrentDate()
    const response = await fetch(`https://tt.sclnau.com.ua/student/GetStudent.php?group=%D0%9A-11&date=${date}`)
    
    if (!response.ok) {
      throw new Error(`Помилка API: ${response.status}`);
      await ctx.reply('Не вдалося отримати розклад занять');
    }

    const data = await response.json();
    const schedule = data.schedule.map((item: { name: any; }) => item); 
    await ctx.reply(`📄 Розклад на <u><b>${date}</b></u>`);
    let scheduleResult: string = "";
    for(const item of schedule){
      scheduleResult += `[${item.pairNumber}] ${item.subject}\nАудиторія: <u><b>${item.room}</b></u>` + "\n\n";
    }

    ctx.reply(scheduleResult);

  })
  .text("Налаштування", async (ctx) => {
    await ctx.reply('Налаштування');
  })
