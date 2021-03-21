import * as Vec3 from "./Vec3";

type Target = (t: number) => Vec3.Vec3 | undefined;

export type Bot = {
    pos: Vec3.Vec3;
    target: Target;
    weight: number;
};

export const newBot = (config: { pos?: Vec3.Vec3; target?: Target; weight?: number }): Bot => ({
    pos: config.pos || Vec3.newVec3(0, 0, 0),
    target: config.target || (() => undefined),
    weight: config.weight || 1
});

export const average = (a: Bot, b: Bot, t1: number, t2: number): Bot => {
    const t = (t1 + t2) / 2;
    let pos = a.target(t);
    if (pos === undefined) {
        const dt = 0.01;
        let targetPrev, targetNext, timePrev, timeNext;
        for (timePrev = t; timePrev >= t1; timePrev -= dt) {
            targetPrev = a.target(timePrev);
            if (targetPrev !== undefined) break;
        }
        for (timeNext = t; timeNext <= t2; timeNext += dt) {
            targetNext = a.target(timeNext);
            if (targetNext !== undefined) break;
        }
        if (targetPrev === undefined && targetNext === undefined)
            pos = Vec3.multiplyScalar(Vec3.add(a.pos, b.pos), 1 / 2);
        if (targetPrev === undefined && targetNext !== undefined) {
            const totalTime = timeNext - t1;
            pos = Vec3.multiplyScalar(
                Vec3.add(Vec3.multiplyScalar(a.pos, timeNext - t), Vec3.multiplyScalar(targetNext, t - t1)),
                1 / totalTime
            );
        }
        if (targetPrev !== undefined && targetNext === undefined) {
            const totalTime = t2 - timePrev;
            pos = Vec3.multiplyScalar(
                Vec3.add(Vec3.multiplyScalar(targetPrev, t2 - t), Vec3.multiplyScalar(b.pos, t - timePrev)),
                1 / totalTime
            );
        }
        if (targetPrev !== undefined && targetNext !== undefined) {
            const totalTime = timeNext - timePrev;
            pos = Vec3.multiplyScalar(
                Vec3.add(Vec3.multiplyScalar(targetPrev, timeNext - t), Vec3.multiplyScalar(targetNext, t - timePrev)),
                1 / totalTime
            );
        }
    }
    return newBot({ ...a, pos: pos });
};
