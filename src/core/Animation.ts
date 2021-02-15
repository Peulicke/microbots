import * as Bot from "./Bot";
import * as World from "./World";
import * as Vec3 from "./Vec3";

const average = (start: World.World, end: World.World): World.World => {
    const result = World.newWorld();
    result.bots = start.bots.map((b, i) => Bot.average(b, end.bots[i]));
    return result;
};

const gradient = (animation: World.World[], dt: number): Vec3.Vec3[][] => {
    const result = [...Array(animation.length)].map(() =>
        [...Array(animation[0].bots.length)].map(() => Vec3.newVec3(0, 0, 0))
    );
    const displacements = [...Array(animation.length)].map(() => [...Array(3 * animation[0].bots.length)].map(() => 0));
    for (let i = 0; i < animation.length; ++i) {
        const before = animation[Math.max(i - 1, 0)];
        const after = animation[Math.min(i + 1, animation.length - 1)];
        displacements[i] = World.displacement(before, after, dt)(animation[i]);
    }
    for (let i = 1; i < animation.length - 1; ++i) {
        const beforeBefore = animation[Math.max(i - 2, 0)];
        const before = animation[i - 1];
        const after = animation[i + 1];
        const afterAfter = animation[Math.min(i + 2, animation.length - 1)];
        result[i] = World.gradient(displacements[i - 1], displacements[i], displacements[i + 1])(
            beforeBefore,
            before,
            after,
            afterAfter,
            dt
        )(animation[i]);
    }
    return result;
};

const optimizeStep = (stepSize: number) => (animation: World.World[], dt: number): void => {
    const g = gradient(animation, dt).map(world =>
        world.map(v => Vec3.multiplyScalar(v, -stepSize / (1 + Vec3.length(v))))
    );
    animation.map((world, i) =>
        world.bots.map((bot, j) => {
            if (bot.fixed) return;
            bot.pos = Vec3.add(bot.pos, g[i][j]);
        })
    );
    animation.map(world => World.resolveCollision(world));
};

const subdivide = (animation: World.World[]): World.World[] => {
    const result = [...Array(animation.length * 2 - 1)];
    for (let i = 0; i < animation.length; ++i) result[2 * i] = animation[i];
    for (let i = 1; i < result.length - 1; i += 2) result[i] = average(result[i - 1], result[i + 1]);
    return result;
};

export const createAnimation = (before: World.World, after: World.World, n: number): World.World[] => {
    let result = [before, after];
    let dt = 50;
    for (let i = 0; i < n; ++i) {
        dt /= 2;
        result = subdivide(result);
        result.map(world => World.resolveCollision(world));
        for (let stepSize = 0.025 * dt; stepSize > 0.01; stepSize *= 0.99) {
            optimizeStep(stepSize)(result, dt);
        }
    }
    return result;
};
