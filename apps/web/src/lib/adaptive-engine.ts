/**
 * Adaptive Learning Engine
 *
 * This module implements a simple adaptive learning algorithm that selects
 * questions based on user weaknesses, difficulty, and recent performance.
 */

import { Question, Weakness, ExamType, Prisma } from "@preptap/db";

interface AdaptiveConfig {
  alpha?: number; // Weight for weakness score (default: 0.5)
  beta?: number;  // Weight for difficulty bias (default: 0.3)
  gamma?: number; // Weight for recent wrong rate (default: 0.2)
  learningRate?: number; // Learning rate for updating weakness (default: 0.1)
}

const DEFAULT_CONFIG: Required<AdaptiveConfig> = {
  alpha: 0.5,
  beta: 0.3,
  gamma: 0.2,
  learningRate: 0.1,
};

/**
 * Get adaptive question selection probabilities
 */
export function calculateQuestionProbabilities(
  questions: Question[],
  weaknesses: Map<string, number>, // tag -> weakness score (0=weak, 1=strong)
  recentWrongRate: Map<string, number>, // tag -> recent wrong rate
  config: AdaptiveConfig = {}
): Map<string, number> {
  const { alpha, beta, gamma } = { ...DEFAULT_CONFIG, ...config };
  const probabilities = new Map<string, number>();

  for (const question of questions) {
    let score = 0;

    // Factor 1: Weakness score (higher weakness = higher probability)
    const avgWeakness =
      question.tags.reduce((sum, tag) => sum + (1 - (weaknesses.get(tag) ?? 0.5)), 0) /
      question.tags.length;
    score += alpha * avgWeakness;

    // Factor 2: Difficulty bias (prefer moderate difficulty, avoid too easy/hard)
    const difficultyBias = 1 - Math.abs(0.5 - question.difficulty) * 2;
    score += beta * difficultyBias;

    // Factor 3: Recent wrong rate
    const avgWrongRate =
      question.tags.reduce((sum, tag) => sum + (recentWrongRate.get(tag) ?? 0), 0) /
      question.tags.length;
    score += gamma * avgWrongRate;

    probabilities.set(question.id, Math.max(score, 0.01)); // Ensure positive
  }

  return probabilities;
}

/**
 * Sample questions based on probabilities
 */
export function sampleQuestions(
  questions: Question[],
  probabilities: Map<string, number>,
  count: number
): Question[] {
  const selected: Question[] = [];
  const pool = [...questions];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const totalProb = pool.reduce((sum, q) => sum + (probabilities.get(q.id) ?? 0), 0);
    let random = Math.random() * totalProb;

    for (let j = 0; j < pool.length; j++) {
      random -= probabilities.get(pool[j].id) ?? 0;
      if (random <= 0) {
        selected.push(pool[j]);
        pool.splice(j, 1);
        break;
      }
    }
  }

  return selected;
}

/**
 * Update weakness scores based on session results
 */
export function updateWeaknessScores(
  currentWeaknesses: Map<string, { score: number; totalAttempts: number; correctCount: number }>,
  results: Array<{ tags: string[]; isCorrect: boolean }>,
  config: AdaptiveConfig = {}
): Map<string, { score: number; totalAttempts: number; correctCount: number }> {
  const { learningRate } = { ...DEFAULT_CONFIG, ...config };
  const updated = new Map(currentWeaknesses);

  for (const result of results) {
    for (const tag of result.tags) {
      const current = updated.get(tag) || { score: 0.5, totalAttempts: 0, correctCount: 0 };

      const newTotal = current.totalAttempts + 1;
      const newCorrect = current.correctCount + (result.isCorrect ? 1 : 0);
      const successRate = newCorrect / newTotal;

      // Update score with learning rate
      const newScore = current.score + learningRate * (successRate - current.score);

      updated.set(tag, {
        score: Math.max(0, Math.min(1, newScore)),
        totalAttempts: newTotal,
        correctCount: newCorrect,
      });
    }
  }

  return updated;
}

/**
 * Build a Prisma query for adaptive question selection
 */
export function buildAdaptiveQuery(
  userId: string,
  examType: ExamType,
  weakTags: string[],
  limit: number
): Prisma.QuestionFindManyArgs {
  return {
    where: {
      examType,
      OR: weakTags.length > 0
        ? [
            { tags: { hasSome: weakTags } },
            { difficulty: { gte: 0.4, lte: 0.7 } }, // Moderate difficulty
          ]
        : [{ difficulty: { gte: 0.4, lte: 0.7 } }],
    },
    include: {
      choices: true,
      explanation: true,
    },
    take: limit * 3, // Get more than needed for sampling
  };
}
