import { Context } from "grammy";
import { mainMenu } from "../view/menu.js";

export async function handleStart(ctx: Context) {
  await ctx.reply(
    "Вітаю! Це неофіційний бот для отримання розкладу занять СФК ЛНУП\nЗагляніть сюди, там цікаво: /info",
    { reply_markup: mainMenu }
  );
}