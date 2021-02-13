import { newVec3 } from "./Vec3";
import { newBot, setPos, setWeight, setFixed } from "./Bot";

const defaultPos = newVec3(0, 0, 0);

it("creates a new bot", () => {
    expect(newBot()).toStrictEqual({ pos: defaultPos, weight: 1, fixed: false });
});

it("sets pos", () => {
    const bot = newBot();
    const pos = newVec3(1, 2, 3);
    expect(setPos(pos)(bot)).toStrictEqual({ pos: pos, weight: 1, fixed: false });
});

it("sets weight", () => {
    const bot = newBot();
    const weight = 123;
    expect(setWeight(weight)(bot)).toStrictEqual({ pos: defaultPos, weight: weight, fixed: false });
});

it("sets fixed", () => {
    const bot = newBot();
    const fixed = true;
    expect(setFixed(fixed)(bot)).toStrictEqual({ pos: defaultPos, weight: 1, fixed: fixed });
});
