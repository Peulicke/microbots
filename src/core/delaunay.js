const orient = m =>
    ((m[3][1] * m[4][0] - m[4][1] * m[3][0]) * m[2][2] +
        (m[2][1] * m[4][0] - m[4][1] * m[2][0]) * -m[3][2] +
        (m[2][1] * m[3][0] - m[3][1] * m[2][0]) * m[4][2]) *
        m[1][3] +
    ((m[3][1] * m[4][0] - m[4][1] * m[3][0]) * m[1][2] +
        (m[1][1] * m[4][0] - m[4][1] * m[1][0]) * -m[3][2] +
        (m[1][1] * m[3][0] - m[3][1] * m[1][0]) * m[4][2]) *
        -m[2][3] +
    ((m[2][1] * m[4][0] - m[4][1] * m[2][0]) * m[1][2] +
        (m[1][1] * m[4][0] - m[4][1] * m[1][0]) * -m[2][2] +
        (m[1][1] * m[2][0] - m[2][1] * m[1][0]) * m[4][2]) *
        m[3][3] +
    ((m[2][1] * m[3][0] - m[3][1] * m[2][0]) * m[1][2] +
        (m[1][1] * m[3][0] - m[3][1] * m[1][0]) * -m[2][2] +
        (m[1][1] * m[2][0] - m[2][1] * m[1][0]) * m[3][2]) *
        -m[4][3] +
    ((m[3][1] * m[4][0] - m[4][1] * m[3][0]) * m[1][2] +
        (m[1][1] * m[4][0] - m[4][1] * m[1][0]) * -m[3][2] +
        (m[1][1] * m[3][0] - m[3][1] * m[1][0]) * m[4][2]) *
        m[0][3] +
    ((m[3][1] * m[4][0] - m[4][1] * m[3][0]) * m[0][2] +
        (m[0][1] * m[4][0] - m[4][1] * m[0][0]) * -m[3][2] +
        (m[0][1] * m[3][0] - m[3][1] * m[0][0]) * m[4][2]) *
        -m[1][3] +
    (((m[1][1] * m[4][0] - m[4][1] * m[1][0]) * m[0][2] +
        (m[0][1] * m[4][0] - m[4][1] * m[0][0]) * -m[1][2] +
        (m[0][1] * m[1][0] - m[1][1] * m[0][0]) * m[4][2]) *
        m[3][3] +
        ((m[1][1] * m[3][0] - m[3][1] * m[1][0]) * m[0][2] +
            (m[0][1] * m[3][0] - m[3][1] * m[0][0]) * -m[1][2] +
            (m[0][1] * m[1][0] - m[1][1] * m[0][0]) * m[3][2]) *
            -m[4][3] +
        ((m[2][1] * m[3][0] - m[3][1] * m[2][0]) * m[1][2] +
            (m[1][1] * m[3][0] - m[3][1] * m[1][0]) * -m[2][2] +
            (m[1][1] * m[2][0] - m[2][1] * m[1][0]) * m[3][2]) *
            m[0][3] +
        ((m[2][1] * m[3][0] - m[3][1] * m[2][0]) * m[0][2] +
            (m[0][1] * m[3][0] - m[3][1] * m[0][0]) * -m[2][2] +
            (m[0][1] * m[2][0] - m[2][1] * m[0][0]) * m[3][2]) *
            -m[1][3] +
        ((m[1][1] * m[3][0] - m[3][1] * m[1][0]) * m[0][2] +
            (m[0][1] * m[3][0] - m[3][1] * m[0][0]) * -m[1][2] +
            (m[0][1] * m[1][0] - m[1][1] * m[0][0]) * m[3][2]) *
            m[2][3] +
        ((m[1][1] * m[2][0] - m[2][1] * m[1][0]) * m[0][2] +
            (m[0][1] * m[2][0] - m[2][1] * m[0][0]) * -m[1][2] +
            (m[0][1] * m[1][0] - m[1][1] * m[0][0]) * m[2][2]) *
            -m[3][3]) -
    (((m[3][1] * m[4][0] - m[4][1] * m[3][0]) * m[2][2] +
        (m[2][1] * m[4][0] - m[4][1] * m[2][0]) * -m[3][2] +
        (m[2][1] * m[3][0] - m[3][1] * m[2][0]) * m[4][2]) *
        m[0][3] +
        ((m[3][1] * m[4][0] - m[4][1] * m[3][0]) * m[0][2] +
            (m[0][1] * m[4][0] - m[4][1] * m[0][0]) * -m[3][2] +
            (m[0][1] * m[3][0] - m[3][1] * m[0][0]) * m[4][2]) *
            -m[2][3] +
        (((m[2][1] * m[4][0] - m[4][1] * m[2][0]) * m[0][2] +
            (m[0][1] * m[4][0] - m[4][1] * m[0][0]) * -m[2][2] +
            (m[0][1] * m[2][0] - m[2][1] * m[0][0]) * m[4][2]) *
            m[3][3] +
            ((m[2][1] * m[3][0] - m[3][1] * m[2][0]) * m[0][2] +
                (m[0][1] * m[3][0] - m[3][1] * m[0][0]) * -m[2][2] +
                (m[0][1] * m[2][0] - m[2][1] * m[0][0]) * m[3][2]) *
                -m[4][3]) +
        (((m[2][1] * m[4][0] - m[4][1] * m[2][0]) * m[1][2] +
            (m[1][1] * m[4][0] - m[4][1] * m[1][0]) * -m[2][2] +
            (m[1][1] * m[2][0] - m[2][1] * m[1][0]) * m[4][2]) *
            m[0][3] +
            ((m[2][1] * m[4][0] - m[4][1] * m[2][0]) * m[0][2] +
                (m[0][1] * m[4][0] - m[4][1] * m[0][0]) * -m[2][2] +
                (m[0][1] * m[2][0] - m[2][1] * m[0][0]) * m[4][2]) *
                -m[1][3] +
            (((m[1][1] * m[4][0] - m[4][1] * m[1][0]) * m[0][2] +
                (m[0][1] * m[4][0] - m[4][1] * m[0][0]) * -m[1][2] +
                (m[0][1] * m[1][0] - m[1][1] * m[0][0]) * m[4][2]) *
                m[2][3] +
                ((m[1][1] * m[2][0] - m[2][1] * m[1][0]) * m[0][2] +
                    (m[0][1] * m[2][0] - m[2][1] * m[0][0]) * -m[1][2] +
                    (m[0][1] * m[1][0] - m[1][1] * m[0][0]) * m[2][2]) *
                    -m[4][3])));

//Ranks a pair of cells up to permutation
function compareCells(a, b) {
    const l1 = a[0] + a[1];
    const m1 = b[0] + b[1];
    let d = l1 + a[2] - (m1 + b[2]);
    if (d) return d;
    const l0 = Math.min(a[0], a[1]);
    const m0 = Math.min(b[0], b[1]);
    d = Math.min(l0, a[2]) - Math.min(m0, b[2]);
    if (d) return d;
    return Math.min(l0 + a[2], l1) - Math.min(m0 + b[2], m1);
}

function Simplex(vertices, adjacent, boundary) {
    this.vertices = vertices;
    this.adjacent = adjacent;
    this.boundary = boundary;
    this.lastVisited = -1;
}

Simplex.prototype.flip = function () {
    const t = this.vertices[0];
    this.vertices[0] = this.vertices[1];
    this.vertices[1] = t;
    const u = this.adjacent[0];
    this.adjacent[0] = this.adjacent[1];
    this.adjacent[1] = u;
};

function GlueFacet(vertices, cell, index) {
    this.vertices = vertices;
    this.cell = cell;
    this.index = index;
}

function Triangulation(vertices, simplices) {
    this.vertices = vertices;
    this.simplices = simplices;
    this.interior = simplices.filter(c => !c.boundary);
    this.tuple = [...this.vertices];
    this.orient = () => orient(this.tuple);
}

//Degenerate situation where we are on boundary, but coplanar to face
Triangulation.prototype.handleBoundaryDegeneracy = function (cell, point) {
    const d = 4;
    const n = this.vertices.length - 1;
    const tuple = this.tuple;
    const verts = this.vertices;

    //Dumb solution: Just do dfs from boundary cell until we find any peak, or terminate
    const toVisit = [cell];
    cell.lastVisited = -n;
    while (toVisit.length > 0) {
        cell = toVisit.pop();
        const cellAdj = cell.adjacent;
        for (let i = 0; i <= d; ++i) {
            const neighbor = cellAdj[i];
            if (!neighbor.boundary || neighbor.lastVisited <= -n) continue;
            const nv = neighbor.vertices;
            for (let j = 0; j <= d; ++j) {
                const vv = nv[j];
                if (vv < 0) tuple[j] = point;
                else tuple[j] = verts[vv];
            }
            const o = this.orient();
            if (o > 0) return neighbor;
            neighbor.lastVisited = -n;
            if (o === 0) toVisit.push(neighbor);
        }
    }
    return null;
};

Triangulation.prototype.walk = function (point, random) {
    //Alias local properties
    const n = this.vertices.length - 1;
    const verts = this.vertices;
    const tuple = this.tuple;

    //Compute initial jump cell
    const initIndex = random ? (this.interior.length * Math.random()) | 0 : this.interior.length - 1;
    let cell = this.interior[initIndex];

    //Start walking
    outerLoop: while (!cell.boundary) {
        const cellVerts = cell.vertices;
        const cellAdj = cell.adjacent;

        for (let i = 0; i <= 4; ++i) {
            tuple[i] = verts[cellVerts[i]];
        }
        cell.lastVisited = n;

        //Find farthest adjacent cell
        for (let i = 0; i <= 4; ++i) {
            const neighbor = cellAdj[i];
            if (neighbor.lastVisited >= n) continue;
            const prev = tuple[i];
            tuple[i] = point;
            const o = this.orient();
            tuple[i] = prev;
            if (o < 0) {
                cell = neighbor;
                continue outerLoop;
            }
            if (!neighbor.boundary) neighbor.lastVisited = n;
            else neighbor.lastVisited = -n;
        }
        return;
    }

    return cell;
};

Triangulation.prototype.addPeaks = function (point, cell) {
    const n = this.vertices.length - 1;
    const verts = this.vertices;
    const tuple = this.tuple;
    const interior = this.interior;
    const simplices = this.simplices;

    //Walking finished at boundary, time to add peaks
    const tovisit = [cell];

    //Stretch initial boundary cell into a peak
    cell.lastVisited = n;
    cell.vertices[cell.vertices.indexOf(-1)] = n;
    cell.boundary = false;
    interior.push(cell);

    //Record a list of all new boundaries created by added peaks so we can glue them together when we are all done
    const glueFacets = [];

    //Do a traversal of the boundary walking outward from starting peak
    while (tovisit.length > 0) {
        //Pop off peak and walk over adjacent cells
        cell = tovisit.pop();
        const cellVerts = cell.vertices;
        const cellAdj = cell.adjacent;
        const indexOfN = cellVerts.indexOf(n);
        if (indexOfN < 0) continue;

        for (let i = 0; i <= 4; ++i) {
            if (i === indexOfN) continue;

            //For each boundary neighbor of the cell
            const neighbor = cellAdj[i];
            if (!neighbor.boundary || neighbor.lastVisited >= n) continue;

            const nv = neighbor.vertices;

            //Test if neighbor is a peak
            if (neighbor.lastVisited !== -n) {
                //Compute orientation of p relative to each boundary peak
                let indexOfNeg1 = 0;
                for (let j = 0; j <= 4; ++j) {
                    if (nv[j] < 0) {
                        indexOfNeg1 = j;
                        tuple[j] = point;
                    } else tuple[j] = verts[nv[j]];
                }
                const o = this.orient();

                //Test if neighbor cell is also a peak
                if (o > 0) {
                    nv[indexOfNeg1] = n;
                    neighbor.boundary = false;
                    interior.push(neighbor);
                    tovisit.push(neighbor);
                    neighbor.lastVisited = n;
                    continue;
                }
                neighbor.lastVisited = -n;
            }

            const na = neighbor.adjacent;

            //Otherwise, replace neighbor with new face
            const vverts = cellVerts.slice();
            const vadj = cellAdj.slice();
            const ncell = new Simplex(vverts, vadj, true);
            simplices.push(ncell);

            //Connect to neighbor
            const opposite = na.indexOf(cell);
            if (opposite < 0) continue;

            na[opposite] = ncell;
            vadj[indexOfN] = neighbor;

            //Connect to cell
            vverts[i] = -1;
            vadj[i] = cell;
            cellAdj[i] = ncell;

            //Flip facet
            ncell.flip();

            //Add to glue list
            for (let j = 0; j <= 4; ++j) {
                const uu = vverts[j];
                if (uu < 0 || uu === n) continue;
                let nface = new Array(3);
                let nptr = 0;
                for (let k = 0; k <= 4; ++k) {
                    const vv = vverts[k];
                    if (vv < 0 || k === j) continue;
                    nface[nptr++] = vv;
                }
                glueFacets.push(new GlueFacet(nface, ncell, j));
            }
        }
    }

    //Glue boundary facets together
    glueFacets.sort((a, b) => compareCells(a.vertices, b.vertices));

    for (let i = 0; i + 1 < glueFacets.length; i += 2) {
        const a = glueFacets[i];
        const b = glueFacets[i + 1];
        const ai = a.index;
        const bi = b.index;
        if (ai < 0 || bi < 0) continue;
        a.cell.adjacent[a.index] = b.cell;
        b.cell.adjacent[b.index] = a.cell;
    }
};

Triangulation.prototype.insert = function (point, random) {
    //Add point
    const verts = this.vertices;
    verts.push(point);

    let cell = this.walk(point, random);
    if (!cell) return;

    //Alias local properties
    const tuple = this.tuple;

    //Degenerate case: If point is coplanar to cell, then walk until we find a non-degenerate boundary
    for (let i = 0; i <= 4; ++i) {
        const vv = cell.vertices[i];
        if (vv < 0) tuple[i] = point;
        else tuple[i] = verts[vv];
    }
    const o = this.orient(tuple);
    if (o < 0) return;
    if (o === 0) {
        cell = this.handleBoundaryDegeneracy(cell, point);
        if (!cell) return;
    }

    //Add peaks
    this.addPeaks(point, cell);
};

//Extract all boundary cells
Triangulation.prototype.boundary = function () {
    const d = 4;
    const boundary = [];
    const cells = this.simplices;
    const nc = cells.length;
    for (let i = 0; i < nc; ++i) {
        const c = cells[i];
        if (c.boundary) {
            const bcell = new Array(d);
            const cv = c.vertices;
            let ptr = 0;
            let parity = 0;
            for (let j = 0; j <= d; ++j) {
                if (cv[j] >= 0) {
                    bcell[ptr++] = cv[j];
                } else {
                    parity = j & 1;
                }
            }
            if (parity === (d & 1)) {
                const t = bcell[0];
                bcell[0] = bcell[1];
                bcell[1] = t;
            }
            boundary.push(bcell);
        }
    }
    return boundary;
};

function incrementalConvexHull(points, randomSearch) {
    const n = points.length;
    if (n === 0) {
        throw new Error("Must have at least d+1 points");
    }
    const d = points[0].length;
    if (n <= d) {
        throw new Error("Must input at least d+1 points");
    }

    //FIXME: This could be degenerate, but need to select d+1 non-coplanar points to bootstrap process
    const initialSimplex = points.slice(0, d + 1);

    //Make sure initial simplex is positively oriented
    const o = orient(initialSimplex);
    if (o === 0) {
        throw new Error("Input not in general position");
    }
    const initialCoords = new Array(d + 1);
    for (let i = 0; i <= d; ++i) {
        initialCoords[i] = i;
    }
    if (o < 0) {
        initialCoords[0] = 1;
        initialCoords[1] = 0;
    }

    //Create initial topological index, glue pointers together (kind of messy)
    const initialCell = new Simplex(initialCoords, new Array(d + 1), false);
    const boundary = initialCell.adjacent;
    const list = new Array(d + 2);
    for (let i = 0; i <= d; ++i) {
        const verts = initialCoords.slice();
        for (let j = 0; j <= d; ++j) {
            if (j === i) verts[j] = -1;
        }
        const t = verts[0];
        verts[0] = verts[1];
        verts[1] = t;
        const cell = new Simplex(verts, new Array(d + 1), true);
        boundary[i] = cell;
        list[i] = cell;
    }
    list[d + 1] = initialCell;
    for (let i = 0; i <= d; ++i) {
        const verts = boundary[i].vertices;
        const adj = boundary[i].adjacent;
        for (let j = 0; j <= d; ++j) {
            const v = verts[j];
            if (v < 0) {
                adj[j] = initialCell;
                continue;
            }
            for (let k = 0; k <= d; ++k) {
                if (boundary[k].vertices.indexOf(v) < 0) {
                    adj[j] = boundary[k];
                }
            }
        }
    }

    //Initialize triangles
    const triangles = new Triangulation(initialSimplex, list);

    //Insert remaining points
    const useRandom = !!randomSearch;
    for (let i = d + 1; i < n; ++i) {
        triangles.insert(points[i], useRandom);
    }

    //Extract boundary cells
    return triangles.boundary();
}

function LiftedPoint(p, i) {
    this.point = p;
    this.index = i;
}

function triangulate(points) {
    let n = points.length;
    if (n === 0) return [];

    //Lift points, sort
    const lifted = new Array(n);
    let upper = 1.0;
    for (let i = 0; i < n; ++i) {
        const p = points[i];
        const x = new Array(3 + 1);
        let l = 0.0;
        for (let j = 0; j < 3; ++j) {
            const v = p[j];
            x[j] = v;
            l += v * v;
        }
        x[3] = l;
        lifted[i] = new LiftedPoint(x, i);
        upper = Math.max(l, upper);
    }
    lifted.sort((a, b) => {
        for (let i = 0; i < 5; ++i) {
            const s = b.point[i] - a.point[i];
            if (s) return s;
        }
        return 0;
    });

    //Double points
    n = lifted.length;

    //Create new list of points
    const dpoints = new Array(n + 3 + 1);
    const dindex = new Array(n + 3 + 1);

    //Add steiner points at top
    const u = (3 + 1) * (3 + 1) * upper;
    const y = new Array(3 + 1);
    for (let i = 0; i <= 3; ++i) {
        y[i] = 0.0;
    }
    y[3] = u;

    dpoints[0] = y.slice();
    dindex[0] = -1;

    for (let i = 0; i <= 3; ++i) {
        const x = y.slice();
        x[i] = 1;
        dpoints[i + 1] = x;
        dindex[i + 1] = -1;
    }

    //Copy rest of the points over
    for (let i = 0; i < n; ++i) {
        const h = lifted[i];
        dpoints[i + 3 + 1] = h.point;
        dindex[i + 3 + 1] = h.index;
    }

    //Construct convex hull
    let hull = incrementalConvexHull(dpoints, false);
    hull = hull.filter(function (cell) {
        for (let i = 0; i <= 3; ++i) {
            const v = dindex[cell[i]];
            if (v < 0) {
                return false;
            }
            cell[i] = v;
        }
        return true;
    });

    for (let i = 0; i < hull.length; ++i) {
        const h = hull[i];
        const x = h[0];
        h[0] = h[1];
        h[1] = x;
    }

    return hull;
}

export default points => {
    const tri = triangulate(points);
    const connections = points.map(() => ({}));
    tri.map(t => {
        for (let i = 0; i < 4; ++i) {
            for (let j = i + 1; j < 4; ++j) {
                connections[t[i]][t[j]] = true;
                connections[t[j]][t[i]] = true;
            }
        }
    });
    return connections.map(con => Object.keys(con).map(key => Number(key)));
};
