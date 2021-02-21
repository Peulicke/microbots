const dot = (a: number[], b: number[]): number => {
    let result = 0;
    for (let i = 0; i < a.length; ++i) {
        result += a[i] * b[i];
    }
    return result;
};

const matMultVec = (A: number[][], b: number[]): number[] => A.map(row => dot(row, b));

const vecMultNum = (a: number[], b: number): number[] => a.map(v => v * b);

const add = (a: number[], b: number[]): number[] => a.map((v, i) => v + b[i]);

const sub = (a: number[], b: number[]): number[] => a.map((v, i) => v - b[i]);

const clone = (a: number[]): number[] => a.map(v => v);

export const ldiv = (A: number[][], b: number[]): number[] => {
    let x = A[0].map(() => 0);
    let r = sub(b, matMultVec(A, x));
    let p = clone(r);
    let rsold = dot(r, r);
    for (let i = 1; i < b.length; ++i) {
        const Ap = matMultVec(A, p);
        const alpha = rsold / dot(p, Ap);
        x = add(x, vecMultNum(p, alpha));
        r = sub(r, vecMultNum(Ap, alpha));
        const rsnew = dot(r, r);
        if (Math.sqrt(rsnew) < 1e-4) break;
        p = add(r, vecMultNum(p, rsnew / rsold));
        rsold = rsnew;
    }
    return x;
};
