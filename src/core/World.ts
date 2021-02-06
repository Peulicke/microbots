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
import { Bot } from "./Bot";

export type World = { bots: Bot[]; edges: number[][] };

export const newWorld = (): World => ({ bots: [], edges: [] });

export const setBots = (bots: Bot[]) => (world: World): World => {
    world.bots = bots;
    return world;
};

export const initEdges = (world: World): World => {
    const list = [...Array(world.bots.length)].map(() => 1);
    const array = list.map((_, i) => list.map((_, j) => (i === j ? 0 : 1)));
    world.edges = array;
    return world;
};

let power = 4;

const edgeStrength = (d: number): number => 2 / (1 + Math.exp(power * (d - 1)));

export const stiffness = (d: Vector3): Matrix3 => outerProduct(d, d).multiplyScalar(-1 / d.dot(d));

export const stiffnessDerivative = (edgeStrengthFun: (d: number) => number) => (dim: number) => (
    d: Vector3
): Matrix3 => {
    const epsilon = 0.00001;
    const val = d.getComponent(dim);
    const dPlus = d.clone().setComponent(dim, val + epsilon);
    const dMinus = d.clone().setComponent(dim, val - epsilon);
    const plus = stiffness(dPlus).multiplyScalar(edgeStrengthFun(dPlus.length()));
    const minus = stiffness(dMinus).multiplyScalar(edgeStrengthFun(dMinus.length()));
    return subMatrix3(plus, minus).multiplyScalar(1 / (2 * epsilon));
};

export const stiffnessPair = (a: Bot, b: Bot, edge: number): Matrix3 =>
    stiffness(b.pos.clone().sub(a.pos)).multiplyScalar(edge);

export const stiffnessPairDerivative = (edgeStrengthFun: (d: number) => number) => (bot: Bot) => (dim: number) => (
    a: Bot,
    b: Bot
): Matrix3 => {
    if (a !== bot && b !== bot) return new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const derivative = stiffnessDerivative(edgeStrengthFun)(dim)(b.pos.clone().sub(a.pos));
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
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const s = stiffnessPair(world.bots[i], world.bots[j], world.edges[i][j]);
            result[i][i] = subMatrix3(result[i][i], s);
            result[i][j] = addMatrix3(result[i][j], s);
        }
    }
    return removeFixedFromMatrix(world)(result);
};

export const stiffnessMatrixDerivative = (edgeStrengthFun: (d: number) => number) => (i: number) => (dim: number) => (
    world: World
): Matrix3[][] => {
    const result = world.edges.map(() => world.edges.map(() => new Matrix3().multiplyScalar(0)));
    const bot = world.bots[i];
    world.bots.forEach((b, j) => {
        if (i === j) return;
        const s = stiffnessPairDerivative(edgeStrengthFun)(bot)(dim)(world.bots[i], world.bots[j]);
        result[i][i] = subMatrix3(result[i][i], s);
        result[j][j] = subMatrix3(result[j][j], s);
        result[i][j] = addMatrix3(result[i][j], s);
        result[j][i] = addMatrix3(result[j][i], s);
    });
    return removeFixedFromMatrix(world)(result);
};

export const forceMatrix = (world: World): Vector3[] =>
    removeFixedFromVector(world)(world.bots.map(bot => new Vector3(0, -bot.weight, 0)));

export const displacement = (world: World): number[] => {
    const f = numberArrayFromVector3Array(forceMatrix(world));
    const k = numberArrayFromMatrix3Array(stiffnessMatrix(world));
    return ldiv(k, f);
};

export const compliance = (world: World): number => {
    const f = numberArrayFromVector3Array(forceMatrix(world));
    const u = displacement(world);
    return dot(f, u);
};

export const objective = (world: World): number => compliance(world);

export const resolveCollisionStep = (world: World): World => {
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

const updateEdges = (world: World) => {
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const d = world.bots[j].pos.clone().sub(world.bots[i].pos).length();
            world.edges[i][j] = edgeStrength(d);
        }
    }
};

export const optimizeStepNumericalBotDim = (stepSize: number) => (world: World) => (bot: Bot) => (
    dim: number
): World => {
    const epsilon = 0.001;
    const val = bot.pos.getComponent(dim);
    bot.pos.setComponent(dim, val + epsilon);
    updateEdges(world);
    const plus = compliance(world);
    bot.pos.setComponent(dim, val - epsilon);
    updateEdges(world);
    const minus = compliance(world);
    bot.pos.setComponent(dim, val);
    let move = -(plus - minus) * stepSize;
    const maxMove = 0.5;
    if (Math.abs(move) > maxMove) move = maxMove * Math.sign(move);
    bot.pos.setComponent(dim, val + move);
    updateEdges(world);
    return world;
};

export const optimizeStepNumericalBot = (stepSize: number) => (world: World) => (bot: Bot): World => {
    if (bot.fixed) return world;
    const fun = optimizeStepNumericalBotDim(stepSize)(world)(bot);
    [0, 1, 2].map(dim => fun(dim));
    return world;
};

export const gradient = (edgeStrengthFun: (d: number) => number) => (world: World): Vector3[] => {
    const u = displacement(world);
    const result = [...Array(world.bots.length)].map(() => new Vector3(0, 0, 0));
    const res = [...Array(world.bots.length)].map(() =>
        [0, 1, 2].map(() => [...Array(world.bots.length)].map(() => new Vector3(0, 0, 0)))
    );
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            for (let j = 0; j < world.bots.length; ++j) {
                if (i >= j) continue;
                const s = stiffnessPairDerivative(edgeStrengthFun)(world.bots[i])(dim)(world.bots[i], world.bots[j]);
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
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            const dku = numberArrayFromVector3Array(removeFixedFromVector(world)(res[i][dim]));
            result[i].setComponent(dim, -dot(u, dku));
        }
    }
    return result;
};

export const optimizeStepNumerical = (stepSize: number) => (world: World): World => {
    power *= 1.005;
    console.log(power);
    updateEdges(world);
    const g = gradient(edgeStrength)(world).map(v => v.multiplyScalar(-stepSize / (1 + v.length())));
    world.bots.map((bot, i) => {
        if (bot.fixed) return;
        bot.pos.add(g[i]);
    });
    return resolveCollision(world);
};
