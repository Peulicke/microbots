const n = 20;
const width = 4;

const arc = [[0, 0, 0]];

for (let i = 0; i < n; ++i) {
    const angle = (Math.PI / 2) * (i / n);
    arc.push([arc[i][0] + Math.cos(angle), arc[i][1] - Math.sin(angle), 0]);
}

for (let i = 1; i < n + 1; ++i) {
    arc.push([-arc[i][0], arc[i][1], 0]);
}

const m = Math.min(...arc.map(p => p[1]));

arc.forEach((_, i) => (arc[i][1] = arc[i][1] - m + 0.5));

export default {
    title: "Big arc",
    data: [[...[...Array(n + 1)].map((_, i) => [i, 0.5, 0]), ...[...Array(n)].map((_, i) => [-i - 1, 0.5, 0])], arc]
};
