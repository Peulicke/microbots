import { Vector3, Matrix3 } from "three";
import {
    dot,
    outerProduct,
    addMatrix3,
    subMatrix3,
    numberArrayFromVector3Array,
    numberArrayFromMatrix3Array
} from "./utils";
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

export const stiffness = (d: Vector3): Matrix3 =>
    outerProduct(d, d)
        .multiplyScalar(-1 / d.dot(d))
        .multiplyScalar(edgeStrength(d.length()));

export const stiffnessDerivative = (dim: number) => (d: Vector3): Matrix3 => {
    const epsilon = 0.00001;
    const val = d.getComponent(dim);
    const dPlus = d.clone().setComponent(dim, val + epsilon);
    const dMinus = d.clone().setComponent(dim, val - epsilon);
    const plus = stiffness(dPlus);
    const minus = stiffness(dMinus);
    return subMatrix3(plus, minus).multiplyScalar(1 / (2 * epsilon));
};

export const stiffnessPair = (a: Bot.Bot, b: Bot.Bot): Matrix3 => {
    const d = b.pos.clone().sub(a.pos);
    return stiffness(d);
};

export const stiffnessPairDerivative = (bot: Bot.Bot) => (dim: number) => (a: Bot.Bot, b: Bot.Bot): Matrix3 => {
    if (a !== bot && b !== bot) return new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const derivative = stiffnessDerivative(dim)(b.pos.clone().sub(a.pos));
    if (a === bot) return derivative.multiplyScalar(-1);
    return derivative;
};

export const removeFixedFromVector = (world: World) => (vector: Vector3[]): Vector3[] =>
    vector.map((v, i) => (world.bots[i].fixed ? new Vector3(0, 0, 0) : v));

export const removeFixedFromMatrix = (world: World) => (mat: Matrix3[][]): Matrix3[][] =>
    mat.map((vector, i) =>
        vector.map((v, j) => (world.bots[i].fixed || world.bots[j].fixed ? new Matrix3().multiplyScalar(0) : v))
    );

export const stiffnessMatrix = (world: World): Matrix3[][] => {
    const result = world.bots.map(() => world.bots.map(() => new Matrix3().multiplyScalar(0)));
    for (let i = 0; i < world.bots.length; ++i) {
        const sx = stiffness(new Vector3(world.bots[i].pos.y + 0.5, 0, 0)).multiplyScalar(friction);
        const sy = stiffness(new Vector3(0, world.bots[i].pos.y + 0.5, 0));
        const sz = stiffness(new Vector3(0, 0, world.bots[i].pos.y + 0.5)).multiplyScalar(friction);
        result[i][i] = subMatrix3(result[i][i], sx);
        result[i][i] = subMatrix3(result[i][i], sy);
        result[i][i] = subMatrix3(result[i][i], sz);
    }
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const s = stiffnessPair(world.bots[i], world.bots[j]);
            result[i][i] = subMatrix3(result[i][i], s);
            result[i][j] = addMatrix3(result[i][j], s);
        }
    }
    return removeFixedFromMatrix(world)(result);
};

export const acceleration = (before: World, after: World, dt: number) => (world: World): Vector3[] =>
    world.bots.map((bot, i) => {
        const v1 = world.bots[i].pos.clone().sub(before.bots[i].pos.clone()).divideScalar(dt);
        const v2 = after.bots[i].pos.clone().sub(world.bots[i].pos.clone()).divideScalar(dt);
        return v2.sub(v1).divideScalar(dt);
    });

export const forceMatrix = (before: World, after: World, dt: number) => (world: World): Vector3[] => {
    const acc = acceleration(before, after, dt)(world);
    return removeFixedFromVector(world)(
        world.bots.map((bot, i) => new Vector3(0, -1, 0).sub(acc[i]).multiplyScalar(bot.weight))
    );
};

export const displacement = (before: World, after: World, dt: number) => (world: World): number[] => {
    const f = numberArrayFromVector3Array(forceMatrix(before, after, dt)(world));
    const k = numberArrayFromMatrix3Array(stiffnessMatrix(world));
    return ldiv(k, f);
};

export const resolveCollisionStep = (world: World): World => {
    for (let i = 0; i < world.bots.length; ++i) {
        if (world.bots[i].fixed) continue;
        world.bots[i].pos.y = Math.max(world.bots[i].pos.y, 0.5);
    }
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = i + 1; j < world.bots.length; ++j) {
            if (world.bots[i].fixed && world.bots[j].fixed) continue;
            const oneFixed = world.bots[i].fixed || world.bots[j].fixed;
            const d = world.bots[j].pos.clone().sub(world.bots[i].pos);
            const dist = d.length();
            if (dist > 1) continue;
            const n = d.multiplyScalar((1 - dist) / (oneFixed ? 1 : 2) / dist);
            if (!world.bots[i].fixed) world.bots[i].pos = world.bots[i].pos.clone().sub(n);
            if (!world.bots[j].fixed) world.bots[j].pos = world.bots[j].pos.clone().add(n);
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
): Vector3[] => {
    const u = displacement(before, after, dt)(world);
    const result = [...Array(world.bots.length)].map(() => new Vector3(0, 0, 0));
    const res = [...Array(world.bots.length)].map(() =>
        [0, 1, 2].map(() => [...Array(world.bots.length)].map(() => new Vector3(0, 0, 0)))
    );
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            const sx = stiffnessDerivative(dim)(new Vector3(world.bots[i].pos.y + 0.5, 0, 0)).multiplyScalar(friction);
            const sy = stiffnessDerivative(dim)(new Vector3(0, world.bots[i].pos.y + 0.5, 0));
            const sz = stiffnessDerivative(dim)(new Vector3(0, 0, world.bots[i].pos.y + 0.5)).multiplyScalar(friction);
            const ssx = new Vector3(...u.slice(3 * i, 3 * (i + 1))).applyMatrix3(sx);
            res[i][dim][i].sub(ssx);
            const ssy = new Vector3(...u.slice(3 * i, 3 * (i + 1))).applyMatrix3(sy);
            res[i][dim][i].sub(ssy);
            const ssz = new Vector3(...u.slice(3 * i, 3 * (i + 1))).applyMatrix3(sz);
            res[i][dim][i].sub(ssz);
            for (let j = 0; j < world.bots.length; ++j) {
                if (i >= j) continue;
                const s = stiffnessPairDerivative(world.bots[i])(dim)(world.bots[i], world.bots[j]);
                const si = new Vector3(...u.slice(3 * i, 3 * (i + 1))).applyMatrix3(s);
                const sj = new Vector3(...u.slice(3 * j, 3 * (j + 1))).applyMatrix3(s);
                const ss = sj.sub(si);
                res[i][dim][i].add(ss);
                res[i][dim][j].sub(ss);
                res[j][dim][j].add(ss);
                res[j][dim][i].sub(ss);
            }
        }
    }
    const uBefore = displacement(beforeBefore, world, dt)(before);
    const uAfter = displacement(world, afterAfter, dt)(after);
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            const dku = numberArrayFromVector3Array(removeFixedFromVector(world)(res[i][dim]));
            result[i].setComponent(
                dim,
                -dot(u, dku) + 2 * ((2 * u[3 * i + dim] - uBefore[3 * i + dim] - uAfter[3 * i + dim]) / dt ** 2)
            );
        }
    }
    return result;
};
