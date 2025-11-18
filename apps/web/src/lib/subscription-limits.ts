/**
 * Subscription Limits & Feature Gating
 *
 * 무료/유료 사용자 기능 제한 관리
 */

export enum SubscriptionPlan {
  FREE = "FREE",
  BASIC = "BASIC",
  PRO = "PRO",
  PREMIUM = "PREMIUM",
}

export interface PlanLimits {
  // 연습 세션 관련
  dailyPracticeSessions: number; // 하루 연습 세션 수
  questionsPerSession: number; // 세션당 문제 수

  // 기능 접근
  adaptiveLearning: boolean; // AI 기반 적응형 학습
  detailedAnalytics: boolean; // 상세 분석
  mistakeNotebook: boolean; // 오답노트
  videoExplanations: boolean; // 동영상 해설

  // 시험 유형
  availableExamTypes: string[]; // 이용 가능한 시험 유형

  // 리포트
  reportHistoryDays: number; // 리포트 기록 보관 일수

  // 지원
  prioritySupport: boolean; // 우선 지원

  // 추가 기능
  studyGroups: boolean; // 스터디 그룹
  customProblemSets: boolean; // 커스텀 문제집
  offlineMode: boolean; // 오프라인 모드
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  [SubscriptionPlan.FREE]: {
    dailyPracticeSessions: 3, // 하루 3회
    questionsPerSession: 10, // 세션당 10문제
    adaptiveLearning: false,
    detailedAnalytics: false,
    mistakeNotebook: true, // 오답노트는 무료 제공
    videoExplanations: false,
    availableExamTypes: ["수능"], // 수능만 무료
    reportHistoryDays: 7, // 7일간 보관
    prioritySupport: false,
    studyGroups: false,
    customProblemSets: false,
    offlineMode: false,
  },

  [SubscriptionPlan.BASIC]: {
    dailyPracticeSessions: 10, // 하루 10회
    questionsPerSession: 20, // 세션당 20문제
    adaptiveLearning: true,
    detailedAnalytics: true,
    mistakeNotebook: true,
    videoExplanations: false,
    availableExamTypes: ["수능", "TOEIC", "TEPS"],
    reportHistoryDays: 30, // 30일간 보관
    prioritySupport: false,
    studyGroups: false,
    customProblemSets: true,
    offlineMode: false,
  },

  [SubscriptionPlan.PRO]: {
    dailyPracticeSessions: -1, // 무제한
    questionsPerSession: 50, // 세션당 50문제
    adaptiveLearning: true,
    detailedAnalytics: true,
    mistakeNotebook: true,
    videoExplanations: true,
    availableExamTypes: ["수능", "TOEIC", "TEPS", "TOEFL", "IELTS"], // 전체
    reportHistoryDays: 90, // 90일간 보관
    prioritySupport: true,
    studyGroups: true,
    customProblemSets: true,
    offlineMode: false,
  },

  [SubscriptionPlan.PREMIUM]: {
    dailyPracticeSessions: -1, // 무제한
    questionsPerSession: -1, // 무제한
    adaptiveLearning: true,
    detailedAnalytics: true,
    mistakeNotebook: true,
    videoExplanations: true,
    availableExamTypes: ["수능", "TOEIC", "TEPS", "TOEFL", "IELTS"],
    reportHistoryDays: 365, // 1년간 보관
    prioritySupport: true,
    studyGroups: true,
    customProblemSets: true,
    offlineMode: true,
  },
};

/**
 * 사용자의 현재 구독 플랜 제한 조회
 */
export function getPlanLimits(plan: SubscriptionPlan): PlanLimits {
  return PLAN_LIMITS[plan];
}

/**
 * 기능 접근 가능 여부 확인
 */
export function hasFeatureAccess(
  plan: SubscriptionPlan,
  feature: keyof PlanLimits
): boolean {
  const limits = getPlanLimits(plan);
  const value = limits[feature];

  // boolean 값은 그대로 반환
  if (typeof value === "boolean") {
    return value;
  }

  // 숫자 값은 -1(무제한) 또는 0보다 큰 경우 true
  if (typeof value === "number") {
    return value === -1 || value > 0;
  }

  // 배열은 길이가 0보다 큰 경우 true
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return false;
}

/**
 * 시험 유형 접근 가능 여부
 */
export function canAccessExamType(
  plan: SubscriptionPlan,
  examType: string
): boolean {
  const limits = getPlanLimits(plan);
  return limits.availableExamTypes.includes(examType);
}

/**
 * 일일 세션 제한 확인
 */
export function canStartNewSession(
  plan: SubscriptionPlan,
  todaySessionCount: number
): {
  allowed: boolean;
  reason?: string;
  limit?: number;
} {
  const limits = getPlanLimits(plan);

  // 무제한
  if (limits.dailyPracticeSessions === -1) {
    return { allowed: true };
  }

  // 제한 확인
  if (todaySessionCount >= limits.dailyPracticeSessions) {
    return {
      allowed: false,
      reason: `오늘의 연습 세션을 모두 사용했습니다. (${limits.dailyPracticeSessions}회 제한)`,
      limit: limits.dailyPracticeSessions,
    };
  }

  return {
    allowed: true,
    limit: limits.dailyPracticeSessions,
  };
}

/**
 * 세션당 문제 수 제한
 */
export function getMaxQuestionsPerSession(plan: SubscriptionPlan): number {
  const limits = getPlanLimits(plan);
  return limits.questionsPerSession === -1 ? 100 : limits.questionsPerSession;
}

/**
 * 플랜 업그레이드 추천
 */
export interface UpgradeRecommendation {
  shouldUpgrade: boolean;
  reason?: string;
  recommendedPlan?: SubscriptionPlan;
  benefits?: string[];
}

export function getUpgradeRecommendation(
  currentPlan: SubscriptionPlan,
  usage: {
    dailySessionsUsed: number;
    requestedExamType?: string;
    requestedFeature?: keyof PlanLimits;
  }
): UpgradeRecommendation {
  const limits = getPlanLimits(currentPlan);

  // FREE 사용자가 제한에 도달한 경우
  if (currentPlan === SubscriptionPlan.FREE) {
    if (usage.dailySessionsUsed >= limits.dailyPracticeSessions) {
      return {
        shouldUpgrade: true,
        reason: "일일 연습 제한에 도달했습니다",
        recommendedPlan: SubscriptionPlan.BASIC,
        benefits: [
          "하루 10회 연습 세션",
          "AI 기반 적응형 학습",
          "상세한 분석 리포트",
          "TOEIC, TEPS 시험 지원",
        ],
      };
    }

    if (usage.requestedExamType && !canAccessExamType(currentPlan, usage.requestedExamType)) {
      return {
        shouldUpgrade: true,
        reason: `${usage.requestedExamType} 시험은 유료 플랜에서 이용 가능합니다`,
        recommendedPlan: SubscriptionPlan.BASIC,
        benefits: [
          "TOEIC, TEPS 지원",
          "적응형 학습",
          "상세 분석",
        ],
      };
    }
  }

  // BASIC 사용자가 더 많은 기능을 원하는 경우
  if (currentPlan === SubscriptionPlan.BASIC) {
    if (usage.requestedFeature === "videoExplanations") {
      return {
        shouldUpgrade: true,
        reason: "동영상 해설은 PRO 플랜부터 이용 가능합니다",
        recommendedPlan: SubscriptionPlan.PRO,
        benefits: [
          "무제한 연습 세션",
          "동영상 해설",
          "우선 지원",
          "스터디 그룹",
        ],
      };
    }
  }

  return {
    shouldUpgrade: false,
  };
}

/**
 * 플랜 비교
 */
export function comparePlans(planA: SubscriptionPlan, planB: SubscriptionPlan): number {
  const order = [
    SubscriptionPlan.FREE,
    SubscriptionPlan.BASIC,
    SubscriptionPlan.PRO,
    SubscriptionPlan.PREMIUM,
  ];

  return order.indexOf(planA) - order.indexOf(planB);
}

/**
 * 플랜 이름 한글화
 */
export function getPlanDisplayName(plan: SubscriptionPlan): string {
  const names: Record<SubscriptionPlan, string> = {
    [SubscriptionPlan.FREE]: "무료",
    [SubscriptionPlan.BASIC]: "베이직",
    [SubscriptionPlan.PRO]: "프로",
    [SubscriptionPlan.PREMIUM]: "프리미엄",
  };

  return names[plan];
}
