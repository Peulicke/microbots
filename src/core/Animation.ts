import * as Bot from "./Bot";
import * as Vec3 from "./Vec3";
import * as World from "./World";

import aStar, { Grid, botsToGrid } from "./aStar";
import resolveOverlap from "./resolveOverlap";

const average = (grid: Grid, start: World.World, end: World.World): World.World => {
    const avg = (a: Bot.Bot, b: Bot.Bot): Bot.Bot => {
        const result = Bot.clone(a);
        result.pos = aStar(grid, a.pos, b.pos);
        return result;
    };
    const result = World.newWorld();
    result.bots = start.bots.map((b, i) => avg(b, end.bots[i]));
    return result;
};

const gradient = (
    offset: number,
    slack: number,
    friction: number,
    overlapPenalty: number,
    animation: World.World[],
    dt: number,
    g: number,
    m: number,
    neighbors: number[][][]
): Vec3.Vec3[][] => {
    const result = [...Array(animation.length)].map(() =>
        [...Array(animation[0].bots.length)].map(() => Vec3.newVec3(0, 0, 0))
    );
    const displacements = animation.map(() => [...Array(3 * animation[0].bots.length)].map(() => 0));
    for (let i = 0; i < animation.length; ++i) {
        const before = animation[Math.max(i - 1, 0)];
        const after = animation[Math.min(i + 1, animation.length - 1)];
        displacements[i] = World.displacement(
            offset,
            slack,
            friction,
            before,
            after,
            dt,
            g,
            m,
            animation[i],
            neighbors[i]
        );
    }
    for (let i = 1; i < animation.length; ++i) {
        const beforeBefore = animation[Math.max(i - 2, 0)];
        const before = animation[i - 1];
        const after = animation[Math.min(i + 1, animation.length - 1)];
        const afterAfter = animation[Math.min(i + 2, animation.length - 1)];
        result[i] = World.gradient(
            offset,
            slack,
            friction,
            overlapPenalty,
            displacements[i - 1],
            displacements[i],
            displacements[Math.min(i + 1, animation.length - 1)],
            beforeBefore,
            before,
            after,
            afterAfter,
            dt,
            animation[i],
            neighbors[i],
            i / (animation.length - 1)
        );
    }
    return result;
};

const optimize = (
    offset: number,
    slack: number,
    friction: number,
    overlapPenalty: number,
    neighborRadius: number,
    animation: World.World[],
    dt: number,
    g: number,
    m: number,
    iterations: number
): void => {
    const acc = 0.2 / animation.length;
    const vel = animation.map(world => world.bots.map(() => Vec3.newVec3(0, 0, 0)));
    const connections = animation.map(world => World.connections(world));
    const neighbors = animation.map((world, i) =>
        world.bots.map((_, j) => World.neighbors(neighborRadius, world, connections[i], j))
    );
    for (let iter = 0; iter < iterations; ++iter) {
        let grad = gradient(offset, slack, friction, overlapPenalty, animation, dt, g, m, neighbors);
        grad = grad.map(world => world.map(v => Vec3.multiplyScalar(v, -acc / (1e-4 + Vec3.length(v)))));
        animation.forEach((world, i) => {
            if (i <= 1 || i >= animation.length - 2) return;
            world.bots.forEach((bot, j) => {
                vel[i][j] = Vec3.add(vel[i][j], grad[i][j]);
                vel[i][j] = Vec3.multiplyScalar(vel[i][j], 0.9);
                bot.pos = Vec3.add(bot.pos, vel[i][j]);
            });
        });
    }
};

const dist = (a: Bot.Bot, b: Bot.Bot): number => Vec3.length(Vec3.sub(b.pos, a.pos));

export enum ContractionType {
    Mst,
    Fibers,
    Delaunay
}

const isValidConnection = (
    world: World.World,
    connections: number[][],
    i: number,
    j: number,
    type: ContractionType
): boolean => {
    if (type === ContractionType.Delaunay) return true;
    if (type === ContractionType.Mst) {
        const d = Vec3.dist(world.bots[i].pos, world.bots[j].pos);
        const checked = [...Array(world.bots.length)].map(() => false);
        const check: number[] = [];
        for (let k = 0; k < world.bots.length; ++k) {
            if (world.bots[k].pos[1] + 0.5 < d) check.push(k);
        }
        while (check.length > 0) {
            const k = check.shift();
            if (k === undefined) break;
            if (checked[k]) continue;
            checked[k] = true;
            for (let c = 0; c < connections[k].length; ++c) {
                const l = connections[k][c];
                if (Vec3.dist(world.bots[k].pos, world.bots[l].pos) < d) check.push(l);
            }
        }
        return !(checked[i] && checked[j]);
    }
    for (let k = 0; k < world.bots.length; ++k) {
        if (k === i) continue;
        if (k === j) continue;
        if (
            dist(world.bots[i], world.bots[j]) > world.bots[i].pos[1] + 0.5 &&
            dist(world.bots[i], world.bots[j]) > world.bots[j].pos[1] + 0.5
        )
            return false;
        if (
            dist(world.bots[i], world.bots[j]) > dist(world.bots[i], world.bots[k]) &&
            dist(world.bots[i], world.bots[j]) > dist(world.bots[k], world.bots[j])
        )
            return false;
        if (
            dist(world.bots[i], world.bots[j]) > dist(world.bots[j], world.bots[k]) &&
            dist(world.bots[i], world.bots[j]) > dist(world.bots[i], world.bots[k])
        )
            return false;
    }
    return true;
};

const contract = (world: World.World, iterations: number, type: ContractionType): void => {
    const frac = 0.2;
    for (let iter = 0; iter < iterations; ++iter) {
        world.bots.forEach((a, i) => {
            if (
                world.bots.some((b, j) => {
                    if (i === j) return false;
                    const d = Vec3.sub(a.pos, b.pos);
                    const hD = Vec3.newVec3(d[0], 0, d[2]);
                    const hDistSqr = Vec3.dot(hD, hD);
                    const vDist = d[1];
                    if (a.pos[1] + 0.5 > b.pos[1] + 0.5 && 10 * vDist > hDistSqr) return true;
                    return false;
                })
            )
                return;
            a.pos[1] += frac * (0.5 - a.pos[1]);
        });
        const connections = World.connections(world);
        const validConnections: [number, number][] = [];
        connections.forEach((list, i) => {
            list.forEach(j => {
                if (i >= j) return;
                if (!isValidConnection(world, connections, i, j, type)) return;
                validConnections.push([i, j]);
            });
        });
        validConnections.forEach(([i, j]) => {
            const d = Vec3.sub(world.bots[j].pos, world.bots[i].pos);
            const dLength = Vec3.length(d);
            if (dLength < 1) return;
            const n = Vec3.multiplyScalar(d, frac * ((1 - dLength) / dLength / 2));
            Vec3.subEq(world.bots[i].pos, n);
            Vec3.addEq(world.bots[j].pos, n);
        });
    }
};

const minimizeAcceleration = (animation: World.World[], dt: number): void => {
    const frac = 0.5;
    for (let i = 2; i < animation.length - 2; ++i) {
        animation[i].bots.forEach((bot, j) => {
            const p = Bot.interpolate(
                (i - 1) / (animation.length - 3),
                dt,
                animation[i - 2].bots[j].pos,
                animation[i - 1].bots[j].pos,
                animation[i + 1].bots[j].pos,
                animation[i + 2].bots[j].pos
            );
            bot.pos = Vec3.add(Vec3.multiplyScalar(bot.pos, frac), Vec3.multiplyScalar(p, 1 - frac));
        });
    }
};

const maxAcc = (prev: World.World, now: World.World, next: World.World, dt: number): number => {
    let result = 0;
    for (let i = 0; i < now.bots.length; ++i) {
        const v1 = Vec3.multiplyScalar(Vec3.sub(now.bots[i].pos, prev.bots[i].pos), 1 / dt);
        const v2 = Vec3.multiplyScalar(Vec3.sub(next.bots[i].pos, now.bots[i].pos), 1 / dt);
        const a = Vec3.multiplyScalar(Vec3.sub(v2, v1), 1 / dt);
        result = Math.max(result, Vec3.length(a));
    }
    return result;
};

export const createAnimation = (
    offset: number,
    slack: number,
    friction: number,
    overlapPenalty: number,
    neighborRadius: number,
    gravity: number,
    botMass: number,
    dt: number,
    beforeBefore: World.World,
    before: World.World,
    after: World.World,
    afterAfter: World.World,
    subdivideIterations: number,
    optimizeIterations: number,
    contractionType: ContractionType,
    contractIterations: number,
    minimizeAccelerationIterations: number
): World.World[] => {
    let result = [beforeBefore, before, after, afterAfter];
    const maxAccLimit = 0.2;
    const fixed = before.bots.filter(bot => bot.fixed);
    const grid = botsToGrid(fixed);
    for (let iter = 0; iter < subdivideIterations; ++iter) {
        const tooFast = result.map((world, i) => {
            if (i <= 1 || i >= result.length - 1) return false;
            return maxAcc(result[i - 1], world, result[i + 1], dt) > maxAccLimit;
        });
        if (!tooFast.some(x => x)) break;
        const resultPrev = [...result];
        result = [result[0]];
        tooFast.forEach((tf, i) => {
            if (i === 0) return;
            if (tf) result.push(average(grid, result[result.length - 1], resultPrev[i]));
            result.push(resultPrev[i]);
        });
        console.log(iter, result.length);
        const ro = result.map(world => resolveOverlap(world.bots));
        for (let j = 0; j < contractIterations; ++j) {
            for (let i = 2; i < result.length - 2; ++i) contract(result[i], 1, contractionType);
            result.map((_, k) => ro[k]());
        }
        optimize(
            offset,
            slack,
            friction,
            overlapPenalty,
            neighborRadius,
            result,
            dt,
            gravity,
            botMass,
            optimizeIterations
        );
        if (iter > 3)
            for (let i = 0; i < minimizeAccelerationIterations; ++i) {
                minimizeAcceleration(result, dt);
                result.map((_, k) => ro[k]());
            }
        result.forEach(world =>
            world.bots.forEach((bot, i) => {
                if (bot.fixed) bot.pos = Vec3.clone(result[0].bots[i].pos);
            })
        );
    }
    console.log("done");
    return result.slice(1, result.length - 1);
};
