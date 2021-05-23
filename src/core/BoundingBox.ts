import * as Vec3 from "./Vec3";

export type BoundingBox = {
    min: Vec3.Vec3;
    max: Vec3.Vec3;
};

export const merge = (a: BoundingBox, b: BoundingBox): BoundingBox => ({
    min: Vec3.min(a.min, b.min),
    max: Vec3.max(a.max, b.max)
});
