import * as linear from "linear-solve";

export const ldiv = (A: number[][], b: number[]): number[] => linear.solve(A, b);
