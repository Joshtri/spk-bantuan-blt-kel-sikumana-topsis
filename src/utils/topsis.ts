/**
 * TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
 *
 * Reference: dokumen "FIX_MISEL PROPOSAL" + ringkasan pada
 * `topsis_blt_ringkasan.html`. Implementasi mengikuti langkah baku:
 *   1. Susun matriks keputusan X
 *   2. Normalisasi: r_ij = x_ij / √(Σ x_ij²)
 *   3. Tertimbang: y_ij = w_j × r_ij
 *   4. Solusi ideal:
 *        Benefit → A⁺ = max(y_*j), A⁻ = min(y_*j)
 *        Cost    → A⁺ = min(y_*j), A⁻ = max(y_*j)
 *   5. Jarak Euclidean ke A⁺ dan A⁻
 *   6. Preferensi: V_i = D⁻ / (D⁻ + D⁺)
 *   7. Rank descending; isEligible = V_i ≥ threshold (default 0,5)
 */

export const CriteriaType = {
  Cost: 0,
  Benefit: 1,
} as const;

export type CriteriaTypeValue = (typeof CriteriaType)[keyof typeof CriteriaType];

const DEFAULT_ELIGIBILITY_THRESHOLD = 0.5;
const TIE_EPSILON = 1e-9;

// ---------------------------------------------------------------------------
// Low-level: pure function — matrix in, all intermediate steps out
// ---------------------------------------------------------------------------

export interface TopsisInput {
  /** Decision matrix [m alternatives][n criteria] of raw scale values. */
  matrix: number[][];
  /** Weights per criteria (length n). Should sum to ~1 but not enforced. */
  weights: number[];
  /** Criteria type per column: Cost (0) or Benefit (1). */
  types: CriteriaTypeValue[];
  /** Optional alternative ids (length m) to attach to results. */
  ids?: string[];
  /** Eligibility threshold on preference value (default 0.5). */
  threshold?: number;
}

export interface TopsisRowResult {
  index: number;
  id?: string;
  distancePositive: number;
  distanceNegative: number;
  preferenceValue: number;
  rank: number;
  isEligible: boolean;
}

export interface TopsisSteps {
  /** Echo of original decision matrix. */
  matrix: number[][];
  weights: number[];
  types: CriteriaTypeValue[];
  /** Per-criteria √(Σ x_ij²). */
  denominators: number[];
  /** Step 2 — normalized matrix r_ij. */
  normalized: number[][];
  /** Step 3 — weighted normalized matrix y_ij. */
  weighted: number[][];
  /** Step 4 — ideal positive solution A⁺ per criteria. */
  idealPositive: number[];
  /** Step 4 — ideal negative solution A⁻ per criteria. */
  idealNegative: number[];
  /** Step 5–7 — per-alternative results in original input order. */
  results: TopsisRowResult[];
  /**
   * Two or more preference values are within `TIE_EPSILON`. Tie → ambiguous
   * ranking; consumers should consider blocking save.
   */
  hasTie: boolean;
  threshold: number;
}

export function calculateTopsisSteps(input: TopsisInput): TopsisSteps {
  const {
    matrix,
    weights,
    types,
    ids,
    threshold = DEFAULT_ELIGIBILITY_THRESHOLD,
  } = input;

  const m = matrix.length;
  const n = weights.length;

  if (types.length !== n) {
    throw new Error(
      `TOPSIS: types length (${types.length}) must match weights length (${n}).`,
    );
  }
  for (let i = 0; i < m; i++) {
    if (matrix[i].length !== n) {
      throw new Error(
        `TOPSIS: row ${i} length (${matrix[i].length}) must match weights length (${n}).`,
      );
    }
  }

  // Step 2: column denominators √(Σ x_ij²)
  const denominators = new Array<number>(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sumSq = 0;
    for (let i = 0; i < m; i++) {
      const v = matrix[i][j];
      sumSq += v * v;
    }
    denominators[j] = Math.sqrt(sumSq);
  }

  // Steps 2 & 3: normalized R and weighted-normalized Y
  const normalized: number[][] = Array.from({ length: m }, () =>
    new Array<number>(n).fill(0),
  );
  const weighted: number[][] = Array.from({ length: m }, () =>
    new Array<number>(n).fill(0),
  );
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const denom = denominators[j];
      const r = denom === 0 ? 0 : matrix[i][j] / denom;
      normalized[i][j] = r;
      weighted[i][j] = r * weights[j];
    }
  }

  // Step 4: ideal positive (A⁺) & negative (A⁻)
  const idealPositive = new Array<number>(n).fill(0);
  const idealNegative = new Array<number>(n).fill(0);
  for (let j = 0; j < n; j++) {
    if (m === 0) break;
    let colMin = weighted[0][j];
    let colMax = weighted[0][j];
    for (let i = 1; i < m; i++) {
      const v = weighted[i][j];
      if (v < colMin) colMin = v;
      if (v > colMax) colMax = v;
    }
    if (types[j] === CriteriaType.Benefit) {
      idealPositive[j] = colMax;
      idealNegative[j] = colMin;
    } else {
      idealPositive[j] = colMin;
      idealNegative[j] = colMax;
    }
  }

  // Step 5–6: distances & preference
  const results: TopsisRowResult[] = [];
  for (let i = 0; i < m; i++) {
    let sumPos = 0;
    let sumNeg = 0;
    for (let j = 0; j < n; j++) {
      const dPos = weighted[i][j] - idealPositive[j];
      const dNeg = weighted[i][j] - idealNegative[j];
      sumPos += dPos * dPos;
      sumNeg += dNeg * dNeg;
    }
    const dPositive = Math.sqrt(sumPos);
    const dNegative = Math.sqrt(sumNeg);
    const denom = dPositive + dNegative;
    // Edge case: only one alternative or all alternatives identical → both
    // distances 0. V is undefined; treat as fully eligible (V=1) since the
    // alternative is simultaneously the ideal+ and ideal- solution.
    const preferenceValue = denom === 0 ? 1 : dNegative / denom;

    results.push({
      index: i,
      id: ids?.[i],
      distancePositive: dPositive,
      distanceNegative: dNegative,
      preferenceValue,
      rank: 0,
      isEligible: preferenceValue >= threshold,
    });
  }

  // Step 7: rank by preference desc; tie-break by id (stable, deterministic)
  const sorted = [...results].sort((a, b) => {
    if (b.preferenceValue !== a.preferenceValue) {
      return b.preferenceValue - a.preferenceValue;
    }
    if (a.id != null && b.id != null) {
      return a.id.localeCompare(b.id);
    }
    return a.index - b.index;
  });
  sorted.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  // Tie detection — any two adjacent (after sort) preferences within epsilon
  let hasTie = false;
  for (let i = 1; i < sorted.length; i++) {
    if (
      Math.abs(sorted[i].preferenceValue - sorted[i - 1].preferenceValue) <
      TIE_EPSILON
    ) {
      hasTie = true;
      break;
    }
  }

  return {
    matrix,
    weights,
    types,
    denominators,
    normalized,
    weighted,
    idealPositive,
    idealNegative,
    results: results.sort((a, b) => a.index - b.index),
    hasTie,
    threshold,
  };
}

/** Backward-compatible thin wrapper: returns just the per-row results. */
export function calculateTopsis(input: TopsisInput): TopsisRowResult[] {
  return calculateTopsisSteps(input).results;
}

// ---------------------------------------------------------------------------
// High-level: from backend assessment + criteria DTOs
// ---------------------------------------------------------------------------

export interface TopsisCriteriaInput {
  id: string;
  weight: number;
  criteriaType: CriteriaTypeValue;
  scales: { id: string; criteriaId: string; scaleValue: number }[];
}

export interface TopsisAssessmentInput {
  id: string;
  details: { criteriaScaleId: string; scaleValue: number }[];
}

export interface TopsisAssessmentResult {
  assessmentId: string;
  distancePositive: number;
  distanceNegative: number;
  preferenceValue: number;
  rank: number;
  isEligible: boolean;
}

/**
 * Build a decision matrix from API DTOs, aligned to the order of
 * `criterias`. Missing answers default to 0.
 */
export function buildDecisionMatrix(
  assessments: TopsisAssessmentInput[],
  criterias: TopsisCriteriaInput[],
): number[][] {
  if (assessments.length === 0 || criterias.length === 0) return [];

  const scaleToCriteria = new Map<string, string>();
  const scaleValueById = new Map<string, number>();
  for (const c of criterias) {
    for (const s of c.scales ?? []) {
      scaleToCriteria.set(s.id, s.criteriaId);
      scaleValueById.set(s.id, s.scaleValue);
    }
  }

  return assessments.map((a) => {
    const valueByCriteria = new Map<string, number>();
    for (const d of a.details) {
      const criteriaId = scaleToCriteria.get(d.criteriaScaleId);
      if (!criteriaId) continue;
      const value = d.scaleValue ?? scaleValueById.get(d.criteriaScaleId) ?? 0;
      valueByCriteria.set(criteriaId, value);
    }
    return criterias.map((c) => valueByCriteria.get(c.id) ?? 0);
  });
}

/**
 * Compute TOPSIS results aligned to the shape of POST
 * `/api/assessments/results/bulk`. Skips no validation — caller is expected to
 * have ensured every assessment has an answer for every criteria.
 */
export function calculateTopsisForAssessments(
  assessments: TopsisAssessmentInput[],
  criterias: TopsisCriteriaInput[],
  options?: { threshold?: number },
): TopsisAssessmentResult[] {
  if (assessments.length === 0 || criterias.length === 0) return [];

  const matrix = buildDecisionMatrix(assessments, criterias);
  const weights = criterias.map((c) => c.weight);
  const types = criterias.map((c) => c.criteriaType);
  const ids = assessments.map((a) => a.id);

  const rows = calculateTopsis({
    matrix,
    weights,
    types,
    ids,
    threshold: options?.threshold,
  });

  return rows.map((row) => ({
    assessmentId: row.id ?? assessments[row.index].id,
    distancePositive: row.distancePositive,
    distanceNegative: row.distanceNegative,
    preferenceValue: row.preferenceValue,
    rank: row.rank,
    isEligible: row.isEligible,
  }));
}

/**
 * High-level steps wrapper for the calculation page. Returns full intermediate
 * matrices alongside results, so the UI can render every TOPSIS stage.
 */
export function calculateTopsisStepsForAssessments(
  assessments: TopsisAssessmentInput[],
  criterias: TopsisCriteriaInput[],
  options?: { threshold?: number },
): TopsisSteps {
  const matrix = buildDecisionMatrix(assessments, criterias);
  const weights = criterias.map((c) => c.weight);
  const types = criterias.map((c) => c.criteriaType);
  const ids = assessments.map((a) => a.id);

  return calculateTopsisSteps({
    matrix,
    weights,
    types,
    ids,
    threshold: options?.threshold,
  });
}
