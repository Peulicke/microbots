import { Bot, World } from "../core";
import arc from "./arc";
import bigArc from "./bigArc";
import bigCube from "./bigCube";
import cube from "./cube";
import stack from "./stack";
import towers from "./towers";
import targets from "./targets";

export const examples = [stack, towers, targets, arc, bigArc, cube, bigCube].sort((a, b) => {
    const d = a.world.bots.length - b.world.bots.length;
    if (d === 0) return a.title > b.title ? 1 : -1;
    return d;
});

export default (index: number): [World.World, World.World] => [
    examples[index].world,
    World.setBots(
        examples[index].world.bots.map((bot: Bot.Bot) => {
            return {
                pos: bot.target || bot.pos,
                vel: bot.vel,
                target: bot.target,
                weight: bot.weight
            };
        })
    )(World.newWorld())
];
