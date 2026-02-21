import { Menu } from "@grammyjs/menu";
import { getGroups } from "./features/SelectGroup.js";
import type { BotContext } from "../../bot.js";

export const Settings = new Menu<BotContext>('settings')
  .back('← Назад')
  .row()
  .text("Змінити групу", async (ctx) => {
    await getGroups(ctx)
  })
  
  .text("Якісь інші налаштування", async (ctx) => {
    await ctx.replyWithSticker('CAACAgIAAxkBAAFC74dpmgMaiMawtr65kvsfL6vKy8a3fAAC80wAAj64OUnSf1xluBofLjoE')
  })
  