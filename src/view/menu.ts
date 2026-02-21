import { Menu } from "@grammyjs/menu";
import { getSchedule } from "./features/Shedule.js";
import { Settings } from "./Settings.js";
import { Context } from "grammy";

export const mainMenu = new Menu<Context>('main-menu')
  .text('Розклад', async (ctx) => {
    await getSchedule(ctx);
  })

  .text("Пара зараз", async (ctx) => {
    await ctx.reply("Ну я не знаю ┐('～`；)┌ ");
  })
  .row()
  .submenu("Налаштування", "settings")
  