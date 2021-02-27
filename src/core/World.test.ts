import { newVec3 } from "./Vec3";
import { newMat3, sub } from "./Mat3";
import {
    numberArrayFromVec3Array,
    numberArrayToVec3Array,
    numberArrayFromMat3Array,
    numberArrayToMat3Array
} from "./utils";
import { newBot, setPos } from "./Bot";
import { newWorld, setBots, stiffnessPair } from "./World";

it("creates a new world", () => {
    expect(newWorld()).toStrictEqual({ bots: [] });
});

it("sets bots", () => {
    const world = newWorld();
    const bots = [newBot()];
    expect(setBots(bots)(world)).toStrictEqual({ bots: bots });
});

it("computes stiffness pair", () => {
    const bots = [newBot(), setPos(newVec3(0, 1, 0))(newBot())];
    const expected = newMat3(newVec3(0, 0, 0), newVec3(0, 27 / 32, 0), newVec3(0, 0, 0));
    const d = sub(stiffnessPair(bots[0], bots[1], 1), expected);
    d.flat().map(element => expect(element).toBeCloseTo(0));
});

it("converts from Vec3 array", () => {
    expect(numberArrayFromVec3Array([newVec3(1, 2, 3), newVec3(4, 5, 6)])).toStrictEqual([1, 2, 3, 4, 5, 6]);
});

it("converts to Vec3 array", () => {
    expect(numberArrayToVec3Array([1, 2, 3, 4, 5, 6])).toStrictEqual([newVec3(1, 2, 3), newVec3(4, 5, 6)]);
});

it("converts from Mat3 array", () => {
    expect(
        numberArrayFromMat3Array([
            [
                newMat3(newVec3(1, 2, 3), newVec3(4, 5, 6), newVec3(7, 8, 9)),
                newMat3(newVec3(11, 12, 13), newVec3(14, 15, 16), newVec3(17, 18, 19))
            ],
            [
                newMat3(newVec3(21, 22, 23), newVec3(24, 25, 26), newVec3(27, 28, 29)),
                newMat3(newVec3(31, 32, 33), newVec3(34, 35, 36), newVec3(37, 38, 39))
            ]
        ])
    ).toStrictEqual([
        [1, 2, 3, 11, 12, 13],
        [4, 5, 6, 14, 15, 16],
        [7, 8, 9, 17, 18, 19],
        [21, 22, 23, 31, 32, 33],
        [24, 25, 26, 34, 35, 36],
        [27, 28, 29, 37, 38, 39]
    ]);
});

it("converts to Mat3 array", () => {
    expect(
        numberArrayToMat3Array([
            [1, 2, 3, 11, 12, 13],
            [4, 5, 6, 14, 15, 16],
            [7, 8, 9, 17, 18, 19],
            [21, 22, 23, 31, 32, 33],
            [24, 25, 26, 34, 35, 36],
            [27, 28, 29, 37, 38, 39]
        ])
    ).toStrictEqual([
        [
            newMat3(newVec3(1, 2, 3), newVec3(4, 5, 6), newVec3(7, 8, 9)),
            newMat3(newVec3(11, 12, 13), newVec3(14, 15, 16), newVec3(17, 18, 19))
        ],
        [
            newMat3(newVec3(21, 22, 23), newVec3(24, 25, 26), newVec3(27, 28, 29)),
            newMat3(newVec3(31, 32, 33), newVec3(34, 35, 36), newVec3(37, 38, 39))
        ]
    ]);
});
