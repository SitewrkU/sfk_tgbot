import { Menu } from "@grammyjs/menu";
import { getSchedule } from "./features/Shedule.js";

export const mainMenu = new Menu('main-menu')
  .text('Розклад', async (ctx) => {
    await getSchedule(ctx);
  })

  .text("Пара зараз", async (ctx) => {
    await ctx.reply("Ну я не знаю ┐('～`；)┌ ");
  })
  .row()
  .text("Налаштування", async (ctx) => {
    await ctx.reply('Доробити (Бажано)');
  })
  