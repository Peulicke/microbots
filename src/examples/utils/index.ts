import { Bot, Vec3, World } from "../../core";

type Example = {
    title: string;
    start: World.World;
    end: World.World;
};

const createBots = (coords: Vec3.Vec3[], fixed: boolean): Bot.Bot[] =>
    coords.map(
        (pos): Bot.Bot => ({
            pos,
            fixed
        })
    );

const createWorld = (bots: Bot.Bot[]): World.World => ({ bots });

export const coordsToWorld = (coords: Vec3.Vec3[], fixed: boolean): World.World =>
    createWorld(createBots(coords, fixed));

export const createExample = (title: string, fixed: Vec3.Vec3[], start: Vec3.Vec3[], end: Vec3.Vec3[]): Example => {
    const fixedBots = createBots(fixed, true);
    const startBots = createBots(start, false);
    const endBots = createBots(end, false);
    return {
        title,
        start: createWorld([...fixedBots, ...startBots]),
        end: createWorld([...fixedBots, ...endBots])
    };
};
