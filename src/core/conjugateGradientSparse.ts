export type SparseSymmetric = [number, number, number][];

const clone = (a: number[]): number[] => a.map(v => v);

const dot = (a: number[], b: number[]): number => {
    let result = 0;
    for (let i = 0; i < a.length; ++i) {
        result += a[i] * b[i];
    }
    return result;
};

const addVecMultNum = (a: number[], b: number[], c: number): void => a.forEach((v, i) => (a[i] = v + b[i] * c));

const matMultVec = (A: SparseSymmetric, b: number[]): number[] => {
    const result = b.map(() => 0);
    for (let c = 0; c < A.length; ++c) {
        const i = A[c][0];
        const j = A[c][1];
        if (i > j) continue;
        const v = A[c][2];
        result[i] += v * b[j];
        if (i === j) continue;
        result[j] += v * b[i];
    }
    return result;
};

const cg = (A: SparseSymmetric, b: number[]): number[] => {
    const x = b.map(() => 0);
    const r = clone(b);
    addVecMultNum(r, matMultVec(A, x), -1);
    let p = clone(r);
    let rsold = dot(r, r);
    for (let i = 0; i < 20; ++i) {
        const Ap = matMultVec(A, p);
        const alpha = rsold / dot(p, Ap);
        addVecMultNum(x, p, alpha);
        addVecMultNum(r, Ap, -alpha);
        const rsnew = dot(r, r);
        const pOld = p;
        p = clone(r);
        addVecMultNum(p, pOld, rsnew / rsold);
        rsold = rsnew;
    }
    return x;
};

const preconditioner = (A: SparseSymmetric, b: number[]): number[] => {
    const sum = [...Array(b.length / 3)].map(() => 0);
    for (let c = 0; c < A.length; ++c) {
        const [i, j, v] = A[c];
        if (i > j) continue;
        if (Math.floor(i / 3) !== Math.floor(j / 3)) continue;
        sum[Math.floor(i / 3)] += v;
        if (i === j) continue;
        sum[Math.floor(j / 3)] += v;
    }
    sum.forEach((v, i) => (sum[i] = Math.sqrt(Math.sqrt(3 / v))));
    return sum;
};

const conditionMatrix = (sum: number[], A: SparseSymmetric): void => {
    for (let c = 0; c < A.length; ++c) {
        const i = A[c][0];
        const j = A[c][1];
        if (i > j) continue;
        A[c][2] *= sum[Math.floor(i / 3)];
        A[c][2] *= sum[Math.floor(j / 3)];
    }
};

const conditionVector = (sum: number[], b: number[]): void => {
    for (let i = 0; i < b.length; ++i) {
        b[i] *= sum[Math.floor(i / 3)];
    }
};

export const ldiv = (A: SparseSymmetric, b: number[]): number[] => {
    b = clone(b);
    const sum = preconditioner(A, b);
    conditionMatrix(sum, A);
    conditionVector(sum, b);
    const x = cg(A, b);
    conditionVector(sum, x);
    return x;
};
