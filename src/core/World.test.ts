import { newBot } from "./Bot";
import { newWorld, setBots } from "./World";

it("creates a new world", () => {
    expect(newWorld()).toStrictEqual({ bots: [] });
});

it("sets bots", () => {
    const world = newWorld();
    const bots = [newBot()];
    expect(setBots(bots)(world)).toStrictEqual({ bots: bots });
});
