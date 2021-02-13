import { Vec3, newVec3, add, sub, multiplyScalar, divideScalar, length, clone } from "./Vec3";
import * as Mat3 from "./Mat3";
import { dot, outerProduct, numberArrayFromVec3Array, numberArrayFromMat3Array } from "./utils";
import { ldiv } from "./matrix";
import * as Bot from "./Bot";

export type World = { bots: Bot.Bot[] };

export const newWorld = (): World => ({ bots: [] });

export const setBots = (bots: Bot.Bot[]) => (world: World): World => {
    world.bots = bots;
    return world;
};

const power = 4;
const friction = 0.1;

export const edgeStrength = (d: number): number => 2 / (1 + Math.exp(power * (d - 1)));

export const stiffness = (d: Vec3): Mat3.Mat3 =>
    Mat3.multiplyScalar(outerProduct(d, d), -edgeStrength(length(d)) / dot(d, d));

export const stiffnessDerivative = (dim: number) => (d: Vec3): Mat3.Mat3 => {
    const epsilon = 0.00001;
    const val = d[dim];
    const dPlus = clone(d);
    dPlus[dim] = val + epsilon;
    const dMinus = clone(d);
    dMinus[dim] = val - epsilon;
    const plus = stiffness(dPlus);
    const minus = stiffness(dMinus);
    return Mat3.multiplyScalar(Mat3.sub(plus, minus), 1 / (2 * epsilon));
};

export const stiffnessPair = (a: Bot.Bot, b: Bot.Bot): Mat3.Mat3 => {
    const d = sub(b.pos, a.pos);
    return stiffness(d);
};

export const stiffnessPairDerivative = (bot: Bot.Bot) => (dim: number) => (a: Bot.Bot, b: Bot.Bot): Mat3.Mat3 => {
    if (a !== bot && b !== bot) return Mat3.newMat3(newVec3(0, 0, 0), newVec3(0, 0, 0), newVec3(0, 0, 0));
    const derivative = stiffnessDerivative(dim)(sub(b.pos, a.pos));
    if (a === bot) return Mat3.multiplyScalar(derivative, -1);
    return derivative;
};

export const removeFixedFromVector = (world: World) => (vector: Vec3[]): Vec3[] =>
    vector.map((v, i) => (world.bots[i].fixed ? newVec3(0, 0, 0) : v));

export const removeFixedFromMatrix = (world: World) => (mat: Mat3.Mat3[][]): Mat3.Mat3[][] =>
    mat.map((vector, i) =>
        vector.map((v, j) =>
            world.bots[i].fixed || world.bots[j].fixed
                ? Mat3.newMat3(newVec3(0, 0, 0), newVec3(0, 0, 0), newVec3(0, 0, 0))
                : v
        )
    );

export const stiffnessMatrix = (world: World): Mat3.Mat3[][] => {
    const result = world.bots.map(() =>
        world.bots.map(() => Mat3.newMat3(newVec3(0, 0, 0), newVec3(0, 0, 0), newVec3(0, 0, 0)))
    );
    for (let i = 0; i < world.bots.length; ++i) {
        const sx = Mat3.multiplyScalar(stiffness(newVec3(world.bots[i].pos[1] + 0.5, 0, 0)), friction);
        const sy = stiffness(newVec3(0, world.bots[i].pos[1] + 0.5, 0));
        const sz = Mat3.multiplyScalar(stiffness(newVec3(0, 0, world.bots[i].pos[1] + 0.5)), friction);
        result[i][i] = Mat3.sub(result[i][i], sx);
        result[i][i] = Mat3.sub(result[i][i], sy);
        result[i][i] = Mat3.sub(result[i][i], sz);
    }
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const s = stiffnessPair(world.bots[i], world.bots[j]);
            result[i][i] = Mat3.sub(result[i][i], s);
            result[i][j] = Mat3.add(result[i][j], s);
        }
    }
    return removeFixedFromMatrix(world)(result);
};

export const acceleration = (before: World, after: World, dt: number) => (world: World): Vec3[] =>
    world.bots.map((bot, i) => {
        const v1 = divideScalar(sub(world.bots[i].pos, before.bots[i].pos), dt);
        const v2 = divideScalar(sub(after.bots[i].pos, world.bots[i].pos), dt);
        return divideScalar(sub(v2, v1), dt);
    });

export const forceMatrix = (before: World, after: World, dt: number) => (world: World): Vec3[] => {
    const acc = acceleration(before, after, dt)(world);
    return removeFixedFromVector(world)(
        world.bots.map((bot, i) => multiplyScalar(sub(newVec3(0, -1, 0), acc[i]), bot.weight))
    );
};

export const displacement = (before: World, after: World, dt: number) => (world: World): number[] => {
    const f = numberArrayFromVec3Array(forceMatrix(before, after, dt)(world));
    const k = numberArrayFromMat3Array(stiffnessMatrix(world));
    return ldiv(k, f);
};

export const resolveCollisionStep = (world: World): World => {
    for (let i = 0; i < world.bots.length; ++i) {
        if (world.bots[i].fixed) continue;
        world.bots[i].pos[1] = Math.max(world.bots[i].pos[1], 0.5);
    }
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = i + 1; j < world.bots.length; ++j) {
            if (world.bots[i].fixed && world.bots[j].fixed) continue;
            const oneFixed = world.bots[i].fixed || world.bots[j].fixed;
            const d = sub(world.bots[j].pos, world.bots[i].pos);
            const dist = length(d);
            if (dist > 1) continue;
            const n = multiplyScalar(d, (1 - dist) / (oneFixed ? 1 : 2) / dist);
            if (!world.bots[i].fixed) world.bots[i].pos = sub(world.bots[i].pos, n);
            if (!world.bots[j].fixed) world.bots[j].pos = add(world.bots[j].pos, n);
        }
    }
    return world;
};

export const resolveCollision = (world: World): World => {
    let result = world;
    for (let i = 0; i < 10; ++i) result = resolveCollisionStep(result);
    return result;
};

export const gradient = (beforeBefore: World, before: World, after: World, afterAfter: World, dt: number) => (
    world: World
): Vec3[] => {
    const u = displacement(before, after, dt)(world);
    const result = [...Array(world.bots.length)].map(() => newVec3(0, 0, 0));
    const res = [...Array(world.bots.length)].map(() =>
        [0, 1, 2].map(() => [...Array(world.bots.length)].map(() => newVec3(0, 0, 0)))
    );
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            const sx = Mat3.multiplyScalar(
                stiffnessDerivative(dim)(newVec3(world.bots[i].pos[1] + 0.5, 0, 0)),
                friction
            );
            const sy = stiffnessDerivative(dim)(newVec3(0, world.bots[i].pos[1] + 0.5, 0));
            const sz = Mat3.multiplyScalar(
                stiffnessDerivative(dim)(newVec3(0, 0, world.bots[i].pos[1] + 0.5)),
                friction
            );
            const v = newVec3(u[3 * i], u[3 * i + 1], u[3 * i + 2]);
            const vx = Mat3.apply(sx, v);
            const vy = Mat3.apply(sy, v);
            const vz = Mat3.apply(sz, v);
            res[i][dim][i] = sub(res[i][dim][i], vx);
            res[i][dim][i] = sub(res[i][dim][i], vy);
            res[i][dim][i] = sub(res[i][dim][i], vz);
            for (let j = 0; j < world.bots.length; ++j) {
                if (i >= j) continue;
                const s = stiffnessPairDerivative(world.bots[i])(dim)(world.bots[i], world.bots[j]);
                const si = Mat3.apply(s, v);
                const vj = newVec3(u[3 * j], u[3 * j + 1], u[3 * j + 2]);
                const sj = Mat3.apply(s, vj);
                const ss = sub(sj, si);
                res[i][dim][i] = add(res[i][dim][i], ss);
                res[i][dim][j] = sub(res[i][dim][j], ss);
                res[j][dim][j] = add(res[j][dim][j], ss);
                res[j][dim][i] = sub(res[j][dim][i], ss);
            }
        }
    }
    const uBefore = displacement(beforeBefore, world, dt)(before);
    const uAfter = displacement(world, afterAfter, dt)(after);
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            const dku = numberArrayFromVec3Array(removeFixedFromVector(world)(res[i][dim]));
            result[i][dim] =
                -dot(u, dku) + 2 * ((2 * u[3 * i + dim] - uBefore[3 * i + dim] - uAfter[3 * i + dim]) / dt ** 2);
        }
    }
    return result;
};
