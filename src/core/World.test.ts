import { pipe } from "ts-pipe-compose";
import { matrix, subtract, dot } from "mathjs";
import { newBot, setPos } from "./Bot";
import {
    newWorld,
    setBots,
    initEdges,
    stiffnessPair,
    stiffnessPairDerivative,
    stiffnessMatrix,
    stiffnessMatrixDerivative
} from "./World";

it("creates a new world", () => {
    expect(newWorld()).toStrictEqual({ bots: [], edges: matrix([]) });
});

it("sets bots", () => {
    const world = newWorld();
    const bots = [newBot()];
    expect(setBots(bots)(world)).toStrictEqual({ bots: bots, edges: matrix([]) });
});

it("inits edges", () => {
    const bot = newBot();
    const bots = [bot, bot, bot];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(world).toStrictEqual({
        bots: bots,
        edges: matrix([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ])
    });
});

it("computes stiffness pair", () => {
    const bot = newBot();
    const bots = [bot, setPos(matrix([0, 1, 0]))(bot), setPos(matrix([1, 0, 0]))(bot)];
    const expected = matrix([
        [0, 0, 0],
        [0, -1, 0],
        [0, 0, 0]
    ]);
    const d = matrix(subtract(stiffnessPair(bots[0], bots[1], 1), expected).toArray().flat());
    expect(dot(d, d)).toBeCloseTo(0);
});

it("computes stiffness pair derivative", () => {
    const bot1 = newBot();
    const bot2 = setPos(matrix([0, 1, 0]))(newBot());
    const expected = matrix([
        [0, -1, 0],
        [-1, 0, 0],
        [0, 0, 0]
    ]);
    const d = matrix(subtract(stiffnessPairDerivative(bot2)(0)(bot1, bot2, 1), expected).toArray().flat());
    expect(dot(d, d)).toBeCloseTo(0);
});

it("computes stiffness matrix", () => {
    const bot = newBot();
    const bots = [bot, setPos(matrix([0, 1, 0]))(bot), setPos(matrix([1, 0, 0]))(bot)];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const expected = matrix([
        [1, 0, 0, 0, 0, 0, -1, 0, 0],
        [0, 1, 0, 0, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0.5, -0.5, 0, -0.5, 0.5, 0],
        [0, -1, 0, -0.5, 1.5, 0, 0.5, -0.5, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [-1, 0, 0, -0.5, 0.5, 0, 1.5, -0.5, 0],
        [0, 0, 0, 0.5, -0.5, 0, -0.5, 0.5, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    const d = matrix(subtract(stiffnessMatrix(world), expected).toArray().flat());
    expect(dot(d, d)).toBeCloseTo(0);
});

it("computes stiffness matrix derivative", () => {
    const bot = newBot();
    const bot2 = setPos(matrix([0, 1, 0]))(bot);
    const bots = [bot, bot2, setPos(matrix([1, 0, 0]))(bot)];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const expected = matrix([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, -0.5, 0, 0, 0.5, 0, 0],
        [0, 0, 0, 0, 0.5, 0, 0, -0.5, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0.5, 0, 0, -0.5, 0, 0],
        [0, 0, 0, 0, -0.5, 0, 0, 0.5, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    const d = matrix(subtract(stiffnessMatrixDerivative(bot2)(1)(world), expected).toArray().flat());
    expect(dot(d, d)).toBeCloseTo(0);
});
