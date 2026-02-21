import { Menu } from "@grammyjs/menu";
import { handleStart } from "../handlers/start.js";
import { Context } from "grammy";

export const Settings = new Menu<Context>('settings')
  .back('← Назад')
  .row()
  .text("Змінити групу", async (ctx) => {
    await ctx.reply("Хочеш змінити групу? Я подумаю");
  })
  
  .text("блабла", async (ctx) => {
    await ctx.reply('Доробити (Бажано)');
  })
  