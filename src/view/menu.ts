import { Menu } from "@grammyjs/menu";
import { getSchedule } from "./features/Shedule.js";
import type { BotContext } from "../../bot.js";

export const mainMenu = new Menu<BotContext>('main-menu')
  .text('Розклад', async (ctx) => {
    await getSchedule(ctx);
  })

  .text("Пара зараз", async (ctx) => {
    await ctx.reply("Ну я не знаю ┐('～`；)┌ ");
  })
  .row()
  .submenu("Налаштування", "settings")
  