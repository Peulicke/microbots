import update from "immutability-helper";
import { pipe } from "ts-pipe-compose";
import { matrix, Matrix, transpose, multiply, inv } from "mathjs";
import { Vector3, Matrix3 } from "three";
import {
    outerProduct,
    addMatrix3,
    subMatrix3,
    numberArrayFromVector3Array,
    numberArrayFromMatrix3Array,
    numberArrayToMatrix3Array
} from "./utils";
import { Bot, setPos } from "./Bot";

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

export const stiffness = (d: Vector3): Matrix3 => outerProduct(d, d).multiplyScalar(-1 / d.dot(d));

export const stiffnessDerivative = (dim: number) => (d: Vector3): Matrix3 => {
    const e = new Vector3(0, 0, 0).setComponent(dim, 1);
    const de = outerProduct(e, d);
    const k = stiffness(d);
    return addMatrix3(addMatrix3(de, de.clone().transpose()), k.multiplyScalar(2 * d.getComponent(dim))).multiplyScalar(
        -1 / d.dot(d)
    );
};

export const stiffnessPair = (a: Bot, b: Bot, edge: number): Matrix3 =>
    stiffness(b.pos.clone().sub(a.pos)).multiplyScalar(edge);

export const stiffnessPairDerivative = (bot: Bot) => (dim: number) => (a: Bot, b: Bot, edge: number): Matrix3 => {
    if (a !== bot && b !== bot) return new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const derivative = stiffnessDerivative(dim)(b.pos.clone().sub(a.pos)).multiplyScalar(edge);
    if (a === bot) return derivative.multiplyScalar(-1);
    return derivative;
};

export const removeFixedFromVector = (world: World) => (vector: Vector3[]): Vector3[] =>
    vector.filter((_, i) => !world.bots[i].fixed);

export const removeFixedFromMatrix = (world: World) => (mat: Matrix3[][]): Matrix3[][] =>
    mat.filter((_, i) => !world.bots[i].fixed).map(vector => vector.filter((_, j) => !world.bots[j].fixed));

export const assembleMatrix = (world: World, fun: (a: Bot, b: Bot, edge: number) => Matrix3): Matrix3[][] => {
    const result = world.edges.map(() => world.edges.map(() => new Matrix3().multiplyScalar(0)));
    result.forEach((row, i) => {
        row.forEach((edge, j) => {
            if (i === j) return;
            const s = fun(world.bots[i], world.bots[j], world.edges[i][j]);
            result[i][i] = subMatrix3(result[i][i], s);
            result[i][j] = addMatrix3(result[i][j], s);
        });
    });
    return removeFixedFromMatrix(world)(result);
};

export const stiffnessMatrix = (world: World): Matrix3[][] => assembleMatrix(world, stiffnessPair);

export const stiffnessMatrixDerivativeBot = (bot: Bot) => (dim: number) => (world: World): Matrix3[][] =>
    assembleMatrix(world, stiffnessPairDerivative(bot)(dim));

export const stiffnessMatrixDerivativeEdge = (i: number, j: number) => (world: World): Matrix3[][] => {
    const list = [...Array(world.bots.length)].map(() => 0);
    const edges = list.map(() => list);
    edges[i][j] = edges[j][i] = 1;
    const w = update(world, {
        edges: { $set: edges }
    });
    return stiffnessMatrix(w);
};

export const forceMatrix = (world: World): Vector3[] =>
    removeFixedFromVector(world)(world.bots.map(bot => new Vector3(0, -bot.weight, 0)));

export const inverse = (mat: Matrix3[][]): Matrix3[][] =>
    numberArrayToMatrix3Array(inv(matrix(numberArrayFromMatrix3Array(mat))).toArray() as number[][]);

export const compliance = (world: World): number => {
    const f = matrix(numberArrayFromVector3Array(forceMatrix(world)));
    const k = matrix(numberArrayFromMatrix3Array(stiffnessMatrix(world)));
    const ft = transpose(f);
    const kInv = inv(k);
    return (multiply(multiply(ft, kInv), f) as unknown) as number;
};

const mult = (b: Matrix) => (a: Matrix) => multiply(a, b);

export const complianceDerivative = (func: (world: World) => Matrix3[][]) => (world: World): number => {
    const f = matrix(numberArrayFromVector3Array(forceMatrix(world)));
    const dk = matrix(numberArrayFromMatrix3Array(func(world)));
    const k = matrix(numberArrayFromMatrix3Array(stiffnessMatrix(world)));
    const ft = transpose(f);
    const kInv = inv(k);
    return -((pipe(ft, mult(kInv), mult(dk), mult(kInv), mult(f)) as unknown) as number);
};

export const complianceDerivativeBot = (bot: Bot) => (dim: number) => (world: World): number =>
    complianceDerivative(stiffnessMatrixDerivativeBot(bot)(dim))(world);

export const complianceDerivativeEdge = (i: number, j: number) => (world: World): number =>
    complianceDerivative(stiffnessMatrixDerivativeEdge(i, j))(world);

export const distancePenalty = (d: Vector3): number => (d.dot(d) - 1) ** 2;

export const distancePenaltyDerivative = (dim: number) => (d: Vector3): number =>
    4 * ((d.dot(d) - 1) * d.getComponent(dim));

export const distancePenaltyPair = (a: Bot, b: Bot, edge: number): number =>
    distancePenalty(b.pos.clone().sub(a.pos)) * edge;

export const distancePenaltyPairDerivative = (dim: number) => (a: Bot, b: Bot, edge: number): number =>
    distancePenaltyDerivative(dim)(b.pos.clone().sub(a.pos)) * edge;

export const distancePenaltyTotal = (world: World): number => {
    let sum = 0;
    world.edges.forEach((row, i) => {
        row.forEach((edge, j) => {
            if (i >= j) return;
            sum += distancePenaltyPair(world.bots[i], world.bots[j], edge);
        });
    });
    return sum;
};

export const distancePenaltyTotalDerivativeBot = (bot: Bot) => (dim: number) => (world: World): number => {
    let sum = 0;
    world.edges.forEach((row, i) => {
        row.forEach((edge, j) => {
            if (world.bots[j] !== bot) return;
            sum += distancePenaltyPairDerivative(dim)(world.bots[i], world.bots[j], edge);
        });
    });
    return sum;
};

export const distancePenaltyTotalDerivativeEdge = (i: number, j: number) => (world: World): number =>
    distancePenaltyPair(world.bots[i], world.bots[j], 1);

export const objective = (world: World): number => compliance(world) + distancePenaltyTotal(world);

export const objectiveDerivativeBot = (w: number) => (bot: Bot) => (dim: number) => (world: World): number =>
    complianceDerivativeBot(bot)(dim)(world) * (1 - w) + distancePenaltyTotalDerivativeBot(bot)(dim)(world) * w;

export const objectiveDerivativeEdge = (w: number) => (i: number, j: number) => (world: World): number =>
    complianceDerivativeEdge(i, j)(world) * (1 - w) + distancePenaltyTotalDerivativeEdge(i, j)(world) * w;

export const optimizeStepBots = (stepSize: number) => (w: number) => (world: World): World => {
    const maxDist = 0.3;
    const newBots = world.bots.map(bot => {
        if (bot.fixed) return bot;
        const d = new Vector3();
        [0, 1, 2].map(dim => d.setComponent(dim, objectiveDerivativeBot(w)(bot)(dim)(world)));
        let move = d.multiplyScalar(stepSize);
        const moveDist = move.length();
        if (moveDist > maxDist) move = move.multiplyScalar(maxDist / moveDist);
        return setPos(bot.pos.clone().sub(move))(bot);
    });
    return setBots(newBots)(world);
};

export const optimizeStepEdges = (stepSize: number) => (w: number) => (world: World): World => {
    const newEdges = world.edges;
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const d = objectiveDerivativeEdge(w)(i, j)(world);
            newEdges[i][j] = world.edges[i][j] - d * stepSize;
            newEdges[i][j] = Math.max(newEdges[i][j], 0.001);
            newEdges[i][j] = Math.min(newEdges[i][j], 1);
        }
    }
    return update(world, {
        edges: { $set: newEdges }
    });
};

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

export const optimizeStep = (stepSize: number) => (w: number) => (world: World): World => {
    return pipe(world, optimizeStepBots(stepSize)(w), optimizeStepEdges(stepSize)(w), resolveCollision);
};

let qwe = 5;
export const optimizeStepNumericalBotDim = (stepSize: number) => (world: World) => (bot: Bot) => (
    dim: number
): World => {
    const epsilon = 0.001;
    const val = bot.pos.getComponent(dim);
    bot.pos.setComponent(dim, val + epsilon);
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const d = world.bots[j].pos.clone().sub(world.bots[i].pos).length();
            world.edges[i][j] = 1 / (1 + Math.exp(4 * (d - qwe))) + 0.001;
        }
    }
    const plus = compliance(world);
    bot.pos.setComponent(dim, val - epsilon);
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const d = world.bots[j].pos.clone().sub(world.bots[i].pos).length();
            world.edges[i][j] = 1 / (1 + Math.exp(4 * (d - qwe))) + 0.001;
        }
    }
    const minus = compliance(world);
    bot.pos.setComponent(dim, val);
    let move = -(plus - minus) * stepSize;
    const maxMove = 0.5;
    if (Math.abs(move) > maxMove) move = maxMove * Math.sign(move);
    bot.pos.setComponent(dim, val + move);
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const d = world.bots[j].pos.clone().sub(world.bots[i].pos).length();
            world.edges[i][j] = 1 / (1 + Math.exp(4 * (d - qwe))) + 0.001;
        }
    }
    return world;
};

export const optimizeStepNumericalBot = (stepSize: number) => (world: World) => (bot: Bot): World => {
    if (bot.fixed) return world;
    const fun = optimizeStepNumericalBotDim(stepSize)(world)(bot);
    [0, 1, 2].map(dim => fun(dim));
    return world;
};

export const optimizeStepNumerical = (stepSize: number) => (world: World): World => {
    qwe = 1 + (qwe - 1) * 0.99;
    console.log(qwe);
    const fun = optimizeStepNumericalBot(stepSize)(world);
    world.bots.map(bot => fun(bot));
    return resolveCollision(world);
};

export const optimize = (world: World): World => {
    let result = world;
    for (let i = 0; i < 100; ++i) {
        result = optimizeStep(0.01)(0.5)(result);
        console.log(result.bots[3].pos.toArray());
        console.log(result.edges);
    }
    return result;
};
