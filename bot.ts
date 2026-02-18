import path from "node:path";
import * as dotenv from 'dotenv'
dotenv.config();
const TG_API_TOKEN = process.env.TELEGRAM_API
if (!TG_API_TOKEN) {
  throw new Error("BOT_TOKEN відсутній в .env");
}

import { mainMenu } from './src/view/menu.js';

import { editOrReplyMiddleware, type EditOrReplyFlavor } from "grammy-edit-or-reply";
import { InputFile } from "grammy";
import { Bot, Context } from 'grammy';
type MyContext = Context & EditOrReplyFlavor;
const bot = new Bot<MyContext>(TG_API_TOKEN);

import { parseMode } from "@grammyjs/parse-mode";
bot.api.config.use(parseMode("HTML"));
bot.use(editOrReplyMiddleware());
bot.use(mainMenu)


bot.command('start', async (ctx) => {
  await ctx.reply("Вітаю! Це неофіційний бот для отримання розкладу занять СФК ЛНУП\nДодаткова інформація: /info", {
    reply_markup: mainMenu, 
  });
})

bot.command('info', async (ctx) => {
  await ctx.reply('<u>Інформація про проєкт</u>')
  await ctx.reply('Цей проєкт створений виключно в навчальних цілях. Автор не несе відповідальності за робочість бота, код залежить від зовнішнього API tt.sclnau.com.ua та сервера\nТакож, за сервера для цього сайту автору ніхто не платить. Тому існує можливість, що проект перестане працювати через якийсь час.')
  await ctx.reply('Автор: BattWkru (Гарасимів Іван)\nGitHub репозиторій: <a href="https://github.com/SitewrkU/sfk_tgbot">Github</a>\nChangeLog: /changelog\n❔Знайшли помилку або маєте ідею для вдосконалення? Пишіть сюди: @likebattw')
})

bot.command('changelog', async (ctx) => {
  const filePath = path.join(import.meta.dirname, '/', 'devnotes.txt');
  const document = new InputFile(filePath, "ChangeLog.txt");
  await ctx.replyWithDocument(document);
})

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Помилка в оновленні ${ctx?.update.update_id}:`, err.error);
});
bot.start();
console.log('Бот запущений!');