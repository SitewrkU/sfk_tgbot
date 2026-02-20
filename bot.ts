import path from "node:path";
import * as dotenv from 'dotenv'
dotenv.config();
const TG_API_TOKEN = process.env.TELEGRAM_API
if (!TG_API_TOKEN) {
  throw new Error("BOT_TOKEN відсутній в .env");
}

import { mainMenu, getSchedule } from './src/view/menu.js';

import { editOrReplyMiddleware, type EditOrReplyFlavor } from "grammy-edit-or-reply";
import { InputFile } from "grammy";
import { Bot, Context } from 'grammy';
type BotContext = Context & EditOrReplyFlavor;
const bot = new Bot<BotContext>(TG_API_TOKEN);

import { parseMode } from "@grammyjs/parse-mode";
bot.api.config.use(parseMode("HTML"));
bot.use(editOrReplyMiddleware());
bot.use(mainMenu)


bot.command('schedule', async (ctx) => {
  await getSchedule(ctx);
})

bot.command('start', async (ctx) => {
  await ctx.reply("Вітаю! Це неофіційний бот для отримання розкладу занять СФК ЛНУП\nЗагляніть сюди за додатковою інформацією: /info", {
    reply_markup: mainMenu, 
  });
})

bot.command('info', async (ctx) => {
  await ctx.reply('<u>Інформація про проєкт</u>')
  await ctx.reply('Цей бот створений виключно в навчальних цілях. Автор не несе відповідальності за стабільну роботу, адже бот залежить від зовнішнього API tt.sclnau.com.ua та серверів, які він не контролює.\nЦе повністю волонтерський проєкт без зовнішнього фінансування, тому він може припинити існування, коли ресурси закінчаться.')
  await ctx.reply('Автор: BattWkru (Гарасимів Іван)\nGitHub репозиторій: <a href="https://github.com/SitewrkU/sfk_tgbot">Github</a>\nОсобливості: /features\nІсторія розробки: /changelog\nОригінальний сайт: <a href="https://sclnau.com.ua/students/timetable-student.html">Сайт</a>\n❔Знайшли помилку або маєте ідею для вдосконалення? Пишіть сюди: @likebattw\n<tg-spoiler><a href="https://www.pixiv.net/en/tags/%E7%8C%AB%E5%AE%AE%E5%8F%88%E5%A5%88/illustrations">А це що за посилання?</a></tg-spoiler>')
})

bot.command('features', async (ctx) => {
  await ctx.reply('Наш бот дає:\n⭐ Швидкий доступ до розкладу\n⭐ Виправлений неправильний час пар з офіційного розкладу\n⭐ Відображення наступної пари\n⭐ Відображення часу до кінця пари')
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