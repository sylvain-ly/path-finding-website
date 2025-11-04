import { CellType } from './Cell/Cell';
import { setGridWithValue } from './Grid/Grid.helper';

const directions = [
  [0, 1], // droite
  [-1, 0], //
  [1, 0],
  [0, -1],
];

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const isValidCell = (
  row: number,
  col: number,
  grid: CellType[][],
  visited: boolean[][]
): boolean => {
  const rows = grid.length;
  const cols = grid[0].length;
  return (
    row >= 0 &&
    row < rows &&
    col >= 0 &&
    col < cols &&
    !visited[row][col] &&
    (grid[row][col] === 'empty' || grid[row][col] === 'end')
  );
};

const initializePredecessorsArray = (rows: number, cols: number): ([number, number] | null)[][] => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
};

const initializeVisitedArray = (rows: number, cols: number): boolean[][] => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
};

const tracePath = async (
  endRow: number,
  endCol: number,
  predecessors: ([number, number] | null)[][],
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>
) => {
  const reversedPath: [number, number][] = [];

  let currentRow = endRow;
  let currentCol = endCol;

  while (currentRow !== null && currentCol !== null) {
    reversedPath.push([currentRow, currentCol]);

    const nxt = predecessors[currentRow][currentCol];
    if (nxt) {
      currentRow = nxt[0];
      currentCol = nxt[1];
    } else {
      break;
    }
  }

  for (const [row, col] of reversedPath.reverse().slice(1, -1)) {
    setGridWithValue(row, col, 'path', setGrid);
    await nextFrame();
  }
};

/*------------------------------------------- BFS --------------------------------------------- */
function* bfsVisits(
  grid: CellType[][],
  start: [number, number],
  end: [number, number],
  visited: boolean[][],
  predecessors: ([number, number] | null)[][]
): Generator<[number, number], boolean, void> {
  const queue: [number, number][] = [start];
  let head = 0;
  visited[start[0]][start[1]] = true;

  while (head < queue.length) {
    const [row, col] = queue[head++];

    if (row === end[0] && col === end[1]) {
      return true;
    }

    for (const [dr, dc] of directions) {
      const nr = row + dr,
        nc = col + dc;
      if (isValidCell(nr, nc, grid, visited)) {
        visited[nr][nc] = true;
        predecessors[nr][nc] = [row, col];
        queue.push([nr, nc]);
        yield [nr, nc];
      }
    }
  }
  return false;
}

export const bfs = async (
  grid: CellType[][],
  start: [number, number],
  end: [number, number],
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>,
  cellsPerFrame = 1
): Promise<boolean> => {
  const rows = grid.length;
  const cols = grid[0].length;

  const visited = initializeVisitedArray(rows, cols);
  const predecessors = initializePredecessorsArray(rows, cols);

  const gen = bfsVisits(grid, start, end, visited, predecessors);

  let done = false;
  let gridSnap = grid;

  while (!done) {
    for (let i = 0; i < cellsPerFrame; i++) {
      const step = gen.next();
      if (step.done) {
        done = true;
        break;
      }
      const [r, c] = step.value;
      if (r !== end[0] || c !== end[1]) {
        gridSnap = gridSnap.map((row) => row.slice());
        gridSnap[r][c] = 'visited';
        setGrid(gridSnap);
      }
    }
    await nextFrame();
  }

  if (visited[end[0]][end[1]]) {
    await tracePath(end[0], end[1], predecessors, setGrid);
    return true;
  }
  return false;
};

/*------------------------------------------- DFS --------------------------------------------- */
function* dfsRecGen(
  grid: CellType[][],
  row: number,
  col: number,
  end: [number, number],
  visited: boolean[][],
  predecessors: ([number, number] | null)[][]
): Generator<[number, number], boolean, void> {
  visited[row][col] = true;
  yield [row, col];

  if (row === end[0] && col === end[1]) {
    return true;
  }

  for (const [dr, dc] of directions) {
    const nr = row + dr;
    const nc = col + dc;

    if (isValidCell(nr, nc, grid, visited)) {
      predecessors[nr][nc] = [row, col];
      const found = yield* dfsRecGen(grid, nr, nc, end, visited, predecessors);
      if (found) {
        return true;
      }
    }
  }

  return false;
}

export async function dfs(
  grid: CellType[][],
  start: [number, number],
  end: [number, number],
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>,
  cellsPerFrame = 1
): Promise<boolean> {
  const rows = grid.length;
  const cols = grid[0].length;

  const visited = initializeVisitedArray(rows, cols);
  const predecessors = initializePredecessorsArray(rows, cols);
  const gen = dfsRecGen(grid, start[0], start[1], end, visited, predecessors);

  let done = false;
  let gridSnap = grid;

  while (!done) {
    for (let i = 0; i < cellsPerFrame; i++) {
      const step = gen.next();

      if (step.done) {
        done = true;
        break;
      }

      const [r, c] = step.value;

      if (gridSnap[r][c] !== 'start' && gridSnap[r][c] !== 'end' && gridSnap[r][c] !== 'path') {
        gridSnap = gridSnap.map((row) => row.slice());
        gridSnap[r][c] = 'visited';
        setGrid(gridSnap);
      }
    }

    await nextFrame();
  }

  if (visited[end[0]][end[1]]) {
    await tracePath(end[0], end[1], predecessors, setGrid);
    return true;
  }

  return false;
}
/*------------------------------------------- Djikstras --------------------------------------------- */
type Coord = [number, number];

export class MinHeap<T> {
  private a: T[] = [];
  private less: (x: T, y: T) => boolean;

  constructor(less: (x: T, y: T) => boolean) {
    this.less = less;
  }

  get size(): number {
    return this.a.length;
  }
  isEmpty(): boolean {
    return this.a.length === 0;
  }
  peek(): T | undefined {
    return this.a[0];
  }
  clear(): void {
    this.a.length = 0;
  }

  push(x: T): void {
    const a = this.a;
    a.push(x);
    // sift-up
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!this.less(a[i], a[p])) {
        break;
      } // parent <= enfant
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }

  pop(): T | undefined {
    const a = this.a;
    if (a.length === 0) {
      return undefined;
    }
    const top = a[0];
    const x = a.pop()!;
    if (a.length) {
      a[0] = x;
      // shift-down
      let i = 0;
      while (true) {
        let s = i;
        const l = i * 2 + 1;
        const r = l + 1;
        if (l < a.length && this.less(a[l], a[s])) {
          s = l;
        }
        if (r < a.length && this.less(a[r], a[s])) {
          s = r;
        }
        if (s === i) {
          break;
        }
        [a[i], a[s]] = [a[s], a[i]];
        i = s;
      }
    }
    return top;
  }
}

type DItem = { r: number; c: number; g: number };
const dijkstraLess = (x: DItem, y: DItem) => x.g < y.g;

// ---- Générateur : yield chaque noeud définitivement extrait (settled)
export function* dijkstraVisits(
  grid: CellType[][],
  start: Coord,
  end: Coord,
  predecessors: (Coord | null)[][]
): Generator<Coord, boolean, void> {
  const rows = grid.length,
    cols = grid[0].length;

  const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < rows && c < cols;

  // distances + ensemble "settled" (noeuds fixés)
  const dist: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const settled: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  const heap = new MinHeap<DItem>(dijkstraLess);
  dist[start[0]][start[1]] = 0;
  heap.push({ r: start[0], c: start[1], g: 0 });

  while (!heap.isEmpty()) {
    const cur = heap.pop()!;
    const { r, c, g } = cur;

    // Ignore les entrées périmées ou déjà fixées
    if (settled[r][c] || g !== dist[r][c]) {
      continue;
    }

    // On "fixe" (settle) ce noeud : moment idéal pour l'afficher
    settled[r][c] = true;
    yield [r, c];

    if (r === end[0] && c === end[1]) {
      return true;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (!inBounds(nr, nc)) {
        continue;
      }
      if (grid[nr][nc] === 'obstacle' || settled[nr][nc]) {
        continue;
      }

      const alt = dist[r][c] + 1;
      if (alt < dist[nr][nc]) {
        dist[nr][nc] = alt;
        predecessors[nr][nc] = [r, c];
        heap.push({ r: nr, c: nc, g: alt });
      }
    }
  }

  return false;
}

export async function djikstras(
  grid: CellType[][],
  start: Coord,
  end: Coord,
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>,
  cellsPerFrame = 1
): Promise<boolean> {
  const rows = grid.length,
    cols = grid[0].length;

  const predecessors: (Coord | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const gen = dijkstraVisits(grid, start, end, predecessors);
  const nextFrame = () => new Promise<void>((res) => requestAnimationFrame(() => res()));

  let done = false;
  let found = false;
  let gridSnap = grid;

  while (!done) {
    for (let i = 0; i < cellsPerFrame; i++) {
      const step = gen.next();
      if (step.done) {
        done = true;
        found = step.value === true;
        break;
      }
      const [r, c] = step.value;

      const isStart = r === start[0] && c === start[1];
      const isEnd = r === end[0] && c === end[1];
      if (!isStart && !isEnd) {
        // clone structurel minimal puis peinture
        gridSnap = gridSnap.map((row) => row.slice());
        if (gridSnap[r][c] !== 'path') {
          gridSnap[r][c] = 'visited';
        }
        setGrid(gridSnap);
      }
    }
    await nextFrame();
  }

  if (found) {
    await tracePath(end[0], end[1], predecessors, setGrid);
    return true;
  }
  return false;
}

const manhattan = (a: Coord, b: Coord) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

// Comparateur pour A*: f minimal d'abord, puis h minimal en tie-break
type AItem = { r: number; c: number; f: number; h: number };
const aStarLess = (x: AItem, y: AItem) => x.f < y.f || (x.f === y.f && x.h < y.h);

// directions (adapte si tu as déjà une constante globale)

// --- Générateur : yield chaque nœud "fermé" (définitivement choisi) ---
export function* astarVisits(
  grid: CellType[][],
  start: Coord,
  end: Coord,
  predecessors: (Coord | null)[][]
): Generator<Coord, boolean, void> {
  const rows = grid.length,
    cols = grid[0].length;
  const inBounds = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols;

  const g: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const closed: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  const heap = new MinHeap<AItem>(aStarLess);

  g[start[0]][start[1]] = 0;
  const h0 = manhattan(start, end);
  heap.push({ r: start[0], c: start[1], f: h0, h: h0 });

  while (!heap.isEmpty()) {
    const cur = heap.pop()!;
    const { r, c, f } = cur;

    // Skip si déjà fermé
    if (closed[r][c]) {
      continue;
    }

    // Skip si entrée obsolète (meilleure g connue depuis)
    const expectedF = g[r][c] + manhattan([r, c], end);
    if (f !== expectedF) {
      continue;
    }

    // On "ferme" ce nœud : moment idéal pour publier/afficher
    closed[r][c] = true;
    yield [r, c];

    if (r === end[0] && c === end[1]) {
      return true;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (!inBounds(nr, nc)) {
        continue;
      }
      if (grid[nr][nc] === 'obstacle' || closed[nr][nc]) {
        continue;
      }

      const tentativeG = g[r][c] + 1;
      if (tentativeG < g[nr][nc]) {
        g[nr][nc] = tentativeG;
        predecessors[nr][nc] = [r, c];
        const h = manhattan([nr, nc], end);
        const nf = tentativeG + h;
        heap.push({ r: nr, c: nc, f: nf, h });
      }
    }
  }

  return false;
}

export async function astar(
  grid: CellType[][],
  start: Coord,
  end: Coord,
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>,
  cellsPerFrame = 1
): Promise<boolean> {
  const rows = grid.length,
    cols = grid[0].length;
  const predecessors: (Coord | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const gen = astarVisits(grid, start, end, predecessors);
  const nextFrame = () => new Promise<void>((res) => requestAnimationFrame(() => res()));

  let done = false;
  let found = false;
  let gridSnap = grid;

  while (!done) {
    for (let i = 0; i < cellsPerFrame; i++) {
      const step = gen.next();
      if (step.done) {
        done = true;
        found = step.value === true;
        break;
      }

      const [r, c] = step.value;
      const isStart = r === start[0] && c === start[1];
      const isEnd = r === end[0] && c === end[1];

      if (!isStart && !isEnd) {
        gridSnap = gridSnap.map((row) => row.slice());
        if (gridSnap[r][c] !== 'path') {
          gridSnap[r][c] = 'visited';
        }
        setGrid(gridSnap);
      }
    }
    await nextFrame();
  }

  if (found) {
    await tracePath(end[0], end[1], predecessors, setGrid);
    return true;
  }
  return false;
}
