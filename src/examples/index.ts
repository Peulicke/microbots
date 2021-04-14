import { Bot, World } from "../core";
import arc from "./arc";
import bigArc from "./bigArc";
import bigCube from "./bigCube";
import crane from "./crane";
import cube from "./cube";
import floorTransport from "./floorTransport";
import frameTransport from "./frameTransport";
import stack from "./stack";
import towers from "./towers";
import transformer from "./transformer";
import transport from "./transport";
import verticalTransport from "./verticalTransport";

export const examples = [
    arc,
    bigArc,
    bigCube,
    crane,
    cube,
    floorTransport,
    frameTransport,
    stack,
    towers,
    transformer,
    transport,
    verticalTransport
].sort((a, b) => {
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
