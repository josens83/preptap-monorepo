/**
 * Spaced Repetition Algorithm (Simplified SM-2)
 *
 * Based on the SuperMemo SM-2 algorithm with simplifications.
 */

export interface SpacedRepetitionItem {
  easinessFactor: number; // EF (default: 2.5)
  interval: number;       // Days until next review
  repetition: number;     // Number of successful reviews
}

export interface ReviewResult {
  quality: number; // 0-5 (0=complete blackout, 5=perfect recall)
}

const MIN_EF = 1.3;
const INITIAL_EF = 2.5;

/**
 * Calculate next review date based on SM-2 algorithm
 */
export function calculateNextReview(
  item: SpacedRepetitionItem,
  quality: number
): SpacedRepetitionItem {
  let { easinessFactor, interval, repetition } = item;

  // Update easiness factor
  easinessFactor = Math.max(
    MIN_EF,
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // If quality < 3, reset repetition but keep EF
  if (quality < 3) {
    repetition = 0;
    interval = 1;
  } else {
    repetition += 1;

    // Calculate new interval
    if (repetition === 1) {
      interval = 1;
    } else if (repetition === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
  }

  return {
    easinessFactor,
    interval,
    repetition,
  };
}

/**
 * Convert user performance to quality score (0-5)
 */
export function performanceToQuality(
  isCorrect: boolean,
  timeSpentMs: number,
  expectedTimeMs: number
): number {
  if (!isCorrect) {
    return 0; // Complete failure
  }

  // Perfect answer within time: 5
  // Good answer: 4
  // Hesitant: 3
  const timeRatio = timeSpentMs / expectedTimeMs;

  if (timeRatio <= 1.0) {
    return 5; // Perfect
  } else if (timeRatio <= 1.5) {
    return 4; // Good
  } else if (timeRatio <= 2.0) {
    return 3; // Hesitant
  } else {
    return 2; // Difficult
  }
}

/**
 * Get initial spaced repetition data for a new item
 */
export function getInitialSRData(): SpacedRepetitionItem {
  return {
    easinessFactor: INITIAL_EF,
    interval: 1,
    repetition: 0,
  };
}

/**
 * Calculate next review date from current date and interval
 */
export function getNextReviewDate(currentDate: Date, intervalDays: number): Date {
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate;
}
