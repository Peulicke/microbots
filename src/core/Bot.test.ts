import { newBot } from "./Bot";

it("creates a new bot", () => {
    const bot = newBot({});
    expect(bot.pos).toStrictEqual([0, 0, 0]);
    expect(bot.target()).toStrictEqual(undefined);
    expect(bot.weight).toStrictEqual(1);
});
