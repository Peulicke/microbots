import * as Bot from "./Bot";
import * as World from "./World";

const average = (start: World.World, end: World.World): World.World => {
    const result = World.newWorld();
    result.bots = start.bots.map((b, i) => Bot.average(b, end.bots[i]));
    return result;
};

export const optimizeStepNumerical = (stepSize: number) => (
    beforeBefore: World.World,
    before: World.World,
    after: World.World,
    afterAfter: World.World,
    dt: number
) => (world: World.World): World.World => {
    const g = World.gradient(
        beforeBefore,
        before,
        after,
        afterAfter,
        dt
    )(world).map(v => v.multiplyScalar(-stepSize / (1 + v.length())));
    world.bots.map((bot, i) => {
        if (bot.fixed) return;
        bot.pos.add(g[i]);
    });
    return World.resolveCollision(world);
};

const subdivide = (animation: World.World[]): World.World[] => {
    const result = [...Array(animation.length * 2 - 1)];
    for (let i = 0; i < animation.length; ++i) result[2 * i] = animation[i];
    for (let i = 1; i < result.length - 1; i += 2) result[i] = average(result[i - 1], result[i + 1]);
    return result;
};

export const createAnimation = (before: World.World, after: World.World, n: number): World.World[] => {
    let result = [before, after];
    let dt = 1000;
    let stepSize = 1;
    for (let i = 0; i < n; ++i) {
        dt /= 2;
        stepSize /= 2;
        result = subdivide(result);
        for (let c = 0; c < 10; ++c) {
            for (let j = 1; j < result.length - 1; j += 2) {
                optimizeStepNumerical(stepSize)(
                    result[Math.max(j - 2, 0)],
                    result[j - 1],
                    result[j + 1],
                    result[Math.min(j + 2, result.length - 1)],
                    dt
                )(result[j]);
            }
            for (let j = 2; j < result.length - 2; j += 2) {
                optimizeStepNumerical(stepSize)(result[j - 2], result[j - 1], result[j + 1], result[j + 2], dt)(
                    result[j]
                );
            }
        }
    }
    optimizeStepNumerical(0.1)(result[0], result[0], result[2], result[2], dt)(result[1]);
    return result;
};
