import { db } from "@preptap/db";

/**
 * Weakness calculation result
 */
export interface WeaknessUpdate {
  score: number;
  totalAttempts: number;
  correctCount: number;
}

/**
 * Session result for weakness calculation
 */
export interface SessionResult {
  questionId: string;
  tags: string[];
  isCorrect: boolean;
}

/**
 * Calculate and update user weakness scores based on session results
 * 
 * This function aggregates results by tag, calculates new scores, and updates the database.
 * 
 * @param userId - User ID
 * @param results - Array of question results with tags
 * @returns Promise<void>
 * 
 * @example
 * ```typescript
 * await calculateAndUpdateWeaknesses(userId, [
 *   { questionId: "q1", tags: ["grammar", "tense"], isCorrect: false },
 *   { questionId: "q2", tags: ["vocabulary"], isCorrect: true },
 * ]);
 * ```
 */
export async function calculateAndUpdateWeaknesses(
  userId: string,
  results: SessionResult[]
): Promise<void> {
  // Get current weaknesses
  const currentWeaknesses = await db.weakness.findMany({
    where: { userId },
  });

  const weaknessMap = new Map<string, WeaknessUpdate>(
    currentWeaknesses.map((w) => [
      w.tag,
      {
        score: w.score,
        totalAttempts: w.totalAttempts,
        correctCount: w.correctCount,
      },
    ])
  );

  // Calculate updates
  const updatedWeaknesses = updateWeaknessScores(weaknessMap, results);

  // Upsert all weaknesses
  await Promise.all(
    Array.from(updatedWeaknesses.entries()).map(([tag, data]) =>
      db.weakness.upsert({
        where: {
          userId_tag: { userId, tag },
        },
        create: {
          userId,
          tag,
          ...data,
        },
        update: data,
      })
    )
  );
}

/**
 * Update weakness scores based on session results
 * 
 * This is a pure function that calculates new weakness scores without database access.
 * 
 * @param weaknessMap - Current weakness scores by tag
 * @param results - Session results
 * @returns Updated weakness map
 * 
 * @internal
 */
export function updateWeaknessScores(
  weaknessMap: Map<string, WeaknessUpdate>,
  results: SessionResult[]
): Map<string, WeaknessUpdate> {
  const updated = new Map(weaknessMap);

  // Group results by tag
  const tagResults = new Map<string, { correct: number; total: number }>();

  for (const result of results) {
    for (const tag of result.tags) {
      const current = tagResults.get(tag) || { correct: 0, total: 0 };
      tagResults.set(tag, {
        correct: current.correct + (result.isCorrect ? 1 : 0),
        total: current.total + 1,
      });
    }
  }

  // Update weakness scores
  for (const [tag, { correct, total }] of tagResults.entries()) {
    const current = updated.get(tag) || {
      score: 0.5,
      totalAttempts: 0,
      correctCount: 0,
    };

    const newTotal = current.totalAttempts + total;
    const newCorrect = current.correctCount + correct;
    const newScore = newCorrect / newTotal;

    updated.set(tag, {
      score: newScore,
      totalAttempts: newTotal,
      correctCount: newCorrect,
    });
  }

  return updated;
}

/**
 * Get user's top weaknesses
 * 
 * @param userId - User ID
 * @param limit - Number of weaknesses to return (default: 10)
 * @returns Top weakness tags sorted by score (ascending)
 */
export async function getTopWeaknesses(
  userId: string,
  limit: number = 10
): Promise<string[]> {
  const weaknesses = await db.weakness.findMany({
    where: { userId },
    orderBy: { score: "asc" },
    take: limit,
  });

  return weaknesses.map((w) => w.tag);
}
