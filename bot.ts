import path from "node:path";
import * as dotenv from 'dotenv'
dotenv.config();
const TG_API_TOKEN = process.env.TELEGRAM_API
if (!TG_API_TOKEN) {
  throw new Error("BOT_TOKEN відсутній в .env");
}

import { mainMenu } from "./src/view/menu.js";
import { Settings } from "./src/view/Settings.js";
import { getSchedule } from "./src/view/features/Shedule.js";
import { getGroups } from "./src/view/features/SelectGroup.js";
import { handleStart } from "./src/handlers/start.js";

import type { SessionData } from "./types/types.js";
import { editOrReplyMiddleware, type EditOrReplyFlavor } from "grammy-edit-or-reply";
import { Bot, Context, InputFile, session, type SessionFlavor} from 'grammy';

export type BotContext = 
  Context 
  & EditOrReplyFlavor 
  & SessionFlavor<SessionData>;
export const bot = new Bot<BotContext>(TG_API_TOKEN);

bot.api.config.use(parseMode("HTML"));
import { parseMode } from "@grammyjs/parse-mode";
bot.use(session({
  initial: (): SessionData => ({ group: undefined }),
}));
bot.use(editOrReplyMiddleware());



mainMenu.register([Settings]);
bot.use(mainMenu)


bot.command('start', handleStart)

bot.command('schedule', async (ctx) => {
  await getSchedule(ctx);
})

bot.command('setgroup', async (ctx) => {
  await getGroups(ctx);
})

bot.command('info', async (ctx) => {
  await ctx.reply('<u>Інформація про проєкт</u>')
  await ctx.reply('Цей бот створений виключно в навчальних цілях. Автор не несе відповідальності за стабільну роботу, адже бот залежить від зовнішнього API tt.sclnau.com.ua та серверів, які він не контролює.\nЦе повністю волонтерський проєкт без зовнішнього фінансування, тому він може припинити існування, коли ресурси закінчаться. <b>За можливості підтримати роботу можна тут: <a href="https://www.privat24.ua/send/ivn0j">Донат</a></b>')
  await ctx.reply('Автор: BattWkru (Гарасимів Іван)\nGitHub репозиторій: <a href="https://github.com/SitewrkU/sfk_tgbot">Github</a>\nОсобливості: /features\nІсторія розробки: /changelog\nОригінальний сайт: <a href="https://sclnau.com.ua/students/timetable-student.html">Сайт</a>\n❔Знайшли помилку або маєте ідею для вдосконалення? Пишіть сюди: @likebattw\n<tg-spoiler><a href="https://www.pixiv.net/en/tags/%E7%8C%AB%E5%AE%AE%E5%8F%88%E5%A5%88/illustrations">А це що за посилання?</a></tg-spoiler>')
})

bot.command('features', async (ctx) => {
  await ctx.reply(
  `Наш бот дає:
  👑 Швидкий доступ до розкладу
  ⭐ Виправлений неправильний час пар з офіційного розкладу
  ⭐ Відображення наступної пари
  ⭐ Відображення часу до кінця пари
  ⭐ Можливість вибрати групу, яка буде запам'ятована для швидкого доступу до розкладу
  ☺️ Відносно зручний, та знайомий інтерфейс телеграму`
  .trim()); 
  await ctx.replyWithSticker('CAACAgIAAxkBAAFC72Bpmf9rp_bIAtKxPOwAAa3bn3p6cjwAAmRvAALdmLBL5aK-J5yM2xE6BA')
})

bot.command('changelog', async (ctx) => {
  const filePath = path.join(import.meta.dirname, '/', 'devnotes.txt');
  const document = new InputFile(filePath, "ChangeLog.txt");
  await ctx.replyWithDocument(document);
})

bot.callbackQuery(/^select_group:(.+)$/, async (ctx) => {

  const groupName = ctx.match[1]; 
  await ctx.answerCallbackQuery();
  ctx.session.group = groupName;
  await ctx.reply(`Встановлена група: ${groupName}`);
  await getSchedule(ctx);
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Помилка в оновленні ${ctx?.update.update_id}:`, err.error);
});
bot.start();
console.log('Бот запущений!');