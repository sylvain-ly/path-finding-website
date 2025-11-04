import { CellType } from './Cell/Cell';

type Coord = [number, number];

const nextFrame = () => new Promise<void>((res) => requestAnimationFrame(() => res()));

const isStartOrEnd = (r: number, c: number, start: Coord, end: Coord) =>
  (r === start[0] && c === start[1]) || (r === end[0] && c === end[1]);

const randEven = (min: number, max: number) => {
  const a = Math.ceil(min / 2) * 2;
  const b = Math.floor(max / 2) * 2;
  return a > b ? null : a + 2 * Math.floor(Math.random() * ((b - a) / 2 + 1));
};
const randOdd = (min: number, max: number) => {
  const a = Math.ceil((min - 1) / 2) * 2 + 1;
  const b = Math.floor((max - 1) / 2) * 2 + 1;
  return a > b ? null : a + 2 * Math.floor(Math.random() * ((b - a) / 2 + 1));
};

/**
 * Choisit l'orientation de coupe, avec un biais (skew).
 * skew: 'vertical' → favorise les murs V ; 'horizontal' → favorise les murs H
 * skewStrength: 0.0..1.0 (0.7 = 70% de chances de choisir l'orientation favorisée quand c'est ambigu)
 */
function pickOrientation(
  height: number,
  width: number,
  skew: 'vertical' | 'horizontal',
  skewStrength = 0.7
): 'H' | 'V' {
  // Cas très rectangulaire : privilégier l'orientation qui coupe le plus court côté
  if (width > height + 1) {return 'V';} // plus large que haut → mur vertical
  if (height > width + 1) {return 'H';} // plus haut que large → mur horizontal

  // Cas ambigu / proche du carré → appliquer le biais
  const pVertical = skew === 'vertical' ? skewStrength : 1 - skewStrength;
  return Math.random() < pVertical ? 'V' : 'H';
}

/** Construit la liste des murs à poser (steps) avec biais d’orientation */
function buildRecursiveDivisionStepsSkew(
  rows: number,
  cols: number,
  start: Coord,
  end: Coord,
  skew: 'vertical' | 'horizontal',
  skewStrength = 0.7
): Coord[] {
  const steps: Coord[] = [];

  // Bordure extérieure
  for (let c = 0; c < cols; c++) {
    if (!isStartOrEnd(0, c, start, end)) {steps.push([0, c]);}
    if (!isStartOrEnd(rows - 1, c, start, end)) {steps.push([rows - 1, c]);}
  }
  for (let r = 1; r < rows - 1; r++) {
    if (!isStartOrEnd(r, 0, start, end)) {steps.push([r, 0]);}
    if (!isStartOrEnd(r, cols - 1, start, end)) {steps.push([r, cols - 1]);}
  }

  const divide = (r0: number, c0: number, r1: number, c1: number) => {
    const height = r1 - r0 + 1;
    const width = c1 - c0 + 1;
    if (height < 3 || width < 3) {return;}

    const orientation = pickOrientation(height, width, skew, skewStrength);

    if (orientation === 'H') {
      // Mur horizontal sur une ligne paire, ouverture sur colonne impaire
      const wallRow = randEven(r0 + 1, r1 - 1);
      if (wallRow == null) {return;}
      const gapCol = randOdd(c0 + 1, c1 - 1);
      if (gapCol == null) {return;}

      for (let c = c0; c <= c1; c++) {
        if (c === gapCol) {continue;}
        if (!isStartOrEnd(wallRow, c, start, end)) {steps.push([wallRow, c]);}
      }
      // Recurse au-dessus et au-dessous
      divide(r0, c0, wallRow - 1, c1);
      divide(wallRow + 1, c0, r1, c1);
    } else {
      // Mur vertical sur une colonne paire, ouverture sur ligne impaire
      const wallCol = randEven(c0 + 1, c1 - 1);
      if (wallCol == null) {return;}
      const gapRow = randOdd(r0 + 1, r1 - 1);
      if (gapRow == null) {return;}

      for (let r = r0; r <= r1; r++) {
        if (r === gapRow) {continue;}
        if (!isStartOrEnd(r, wallCol, start, end)) {steps.push([r, wallCol]);}
      }
      // Recurse à gauche et à droite
      divide(r0, c0, r1, wallCol - 1);
      divide(r0, wallCol + 1, r1, c1);
    }
  };

  divide(1, 1, rows - 2, cols - 2);
  return steps;
}

/** Reset doux du grid : conserve start/end, vide le reste */
function softResetGrid(grid: CellType[][], start: Coord, end: Coord): CellType[][] {
  const rows = grid.length,
    cols = grid[0].length;
  const g = grid.map((row) => row.slice());
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isS = r === start[0] && c === start[1];
      const isE = r === end[0] && c === end[1];
      if (!isS && !isE) {g[r][c] = 'empty';}
    }
  }
  return g;
}

/** Générateur du labyrinthe (animation par frames) */
async function generateMazeWithSteps(
  grid: CellType[][],
  steps: Coord[],
  start: Coord,
  end: Coord,
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>,
  cellsPerFrame: number
) {
  let g = softResetGrid(grid, start, end);
  setGrid(g);

  let i = 0;
  while (i < steps.length) {
    // ✅ clone UNE SEULE fois pour cette frame
    const next = g.map((row) => row.slice());

    let painted = 0;
    while (painted < cellsPerFrame && i < steps.length) {
      const [r, c] = steps[i++];
      if (next[r][c] !== 'start' && next[r][c] !== 'end' && next[r][c] !== 'obstacle') {
        next[r][c] = 'obstacle';
        painted++;
      }
    }

    g = next;
    setGrid(g);

    await nextFrame();
  }
}

/** Version BIAIS VERTICAL (murs majoritairement verticaux) */
export async function generateMazeSkewVertical(
  grid: CellType[][],
  start: Coord,
  end: Coord,
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>,
  cellsPerFrame = 150,
  skewStrength = 0.7 // 70% de préférence verticale en cas d’ambiguïté
): Promise<void> {
  const steps = buildRecursiveDivisionStepsSkew(
    grid.length,
    grid[0].length,
    start,
    end,
    'vertical',
    skewStrength
  );
  await generateMazeWithSteps(grid, steps, start, end, setGrid, cellsPerFrame);
}

/** Version BIAIS HORIZONTAL (murs majoritairement horizontaux) */
export async function generateMazeSkewHorizontal(
  grid: CellType[][],
  start: Coord,
  end: Coord,
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>,
  cellsPerFrame = 150,
  skewStrength = 0.7 // 70% de préférence horizontale en cas d’ambiguïté
): Promise<void> {
  const steps = buildRecursiveDivisionStepsSkew(
    grid.length,
    grid[0].length,
    start,
    end,
    'horizontal',
    skewStrength
  );
  await generateMazeWithSteps(grid, steps, start, end, setGrid, cellsPerFrame);
}
