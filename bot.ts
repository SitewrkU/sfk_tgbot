import * as dotenv from 'dotenv'
dotenv.config();
const TG_API_TOKEN = process.env.TELEGRAM_API
if (!TG_API_TOKEN) {
  throw new Error("BOT_TOKEN відсутній в .env");
}

import { mainMenu } from './src/view/menu.js';

import { Bot } from 'grammy';
const bot = new Bot(TG_API_TOKEN);

import { parseMode } from "@grammyjs/parse-mode";
bot.api.config.use(parseMode("HTML"));
bot.use(mainMenu)


bot.command('start', async (ctx) => {
  await ctx.reply("Вітаю! Це неофіційний бот для отримання розкладу занять СФК ЛНУП\nДодаткова інформація: /info", {
    reply_markup: mainMenu, 
  });
})

bot.command('info', async (ctx) => {
  await ctx.reply('<u>Інформація про проєкт</u>')
  ctx.reply('Автор: BattWkru (Гарасимів Іван)\nGitHub репозиторій:')
})


bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Помилка в оновленні ${ctx?.update.update_id}:`, err.error);
});
bot.start();
console.log('Бот запущений!');