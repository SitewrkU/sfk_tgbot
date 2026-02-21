import { Context } from "grammy";
import type { InlineKeyboardButton } from "grammy/types";

export async function getGroups(ctx: Context) {
  const loadingMsg = await ctx.reply(`🔃 Отримання груп...`);
  const editLoading = (text: string) =>
    ctx.api.editMessageText(ctx.chat!.id, loadingMsg.message_id, text);

  try {
    const response = await fetch(`https://tt.sclnau.com.ua/student/getGroups.php`)
    const data = await response.json();
    
    if (!data?.status || !Array.isArray(data.groups)) {
      await editLoading('❌ Не вдалося отримати список груп. Спробуйте пізніше.');
      return;
    }

    await ctx.api.deleteMessage(ctx.chat!.id, loadingMsg.message_id);

    for (const faculty of data.groups) {
      const facultyKeyboard: InlineKeyboardButton[][] = [];

      for (let i = 0; i < faculty.groups.length; i += 2) {
        const row: InlineKeyboardButton[] = [
          { text: faculty.groups[i], callback_data: `select_group:${faculty.groups[i]}` }
        ];
        if (faculty.groups[i + 1]) {
          row.push({ 
            text: faculty.groups[i + 1], 
            callback_data: `select_group:${faculty.groups[i + 1]}` 
          });
        }
        facultyKeyboard.push(row);
      }
      

      await ctx.reply(faculty.faculty, {
        reply_markup: { inline_keyboard: facultyKeyboard }
      });
    }
    
  } catch (err) {
    console.log(err)
  }
}

