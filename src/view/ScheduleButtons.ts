import { Menu } from "@grammyjs/menu";
import { getSchedule } from "./features/Shedule.js";
import type { BotContext } from "../../bot.js";
import { getGroups } from "./features/SelectGroup.js";

export const scheduleButtons = new Menu<BotContext>('schedule-buttons')
  .text('Оновити розклад', async (ctx) => {
    await getSchedule(ctx);
  })

  .text("Змінити групу", async (ctx) => {
    await getGroups(ctx)
  })
  