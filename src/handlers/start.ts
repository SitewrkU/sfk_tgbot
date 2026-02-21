import { Context } from "grammy";
import { mainMenu } from "../view/Menu.js";

export async function handleStart(ctx: Context) {
  await ctx.reply(
    "Вітаю! Це неофіційний бот для отримання розкладу занять СФК ЛНУП\nЗагляніть сюди за додатковою інформацією: /info",
    { reply_markup: mainMenu }
  );
}