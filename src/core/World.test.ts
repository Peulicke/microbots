import { newVec3 } from "./Vec3";
import { newMat3, sub } from "./Mat3";
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
