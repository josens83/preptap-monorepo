/**
 * Application-wide constants
 */

export const EXAM_TYPES = [
  { id: "SUNEUNG", name: "수능", fullName: "대학수학능력시험" },
  { id: "TOEIC", name: "TOEIC", fullName: "국제 비즈니스 영어 시험" },
  { id: "TEPS", name: "TEPS", fullName: "서울대 영어능력시험" },
  { id: "TOEFL", name: "TOEFL", fullName: "미국 대학 입학 영어시험" },
  { id: "IELTS", name: "IELTS", fullName: "영국식 영어능력시험" },
  { id: "CUSTOM", name: "맞춤형", fullName: "사용자 정의 시험" },
] as const;

export const SCHOOL_LEVELS = [
  { id: "ELEMENTARY", name: "초등학생", description: "초등학교" },
  { id: "MIDDLE", name: "중학생", description: "중학교" },
  { id: "HIGH", name: "고등학생", description: "고등학교" },
  { id: "UNIVERSITY", name: "대학생", description: "대학교" },
  { id: "ADULT", name: "직장인/일반", description: "성인" },
] as const;

export const SESSION_MODES = [
  {
    id: "ADAPTIVE",
    name: "적응형 연습",
    description: "AI가 실력에 맞는 문제를 추천합니다",
    icon: "🎯",
  },
  {
    id: "TIMED",
    name: "시간 제한",
    description: "실제 시험과 같은 시간 제한 모드",
    icon: "⏱️",
  },
  {
    id: "PRACTICE",
    name: "일반 연습",
    description: "자유롭게 문제를 풀어보세요",
    icon: "✏️",
  },
  {
    id: "REVIEW",
    name: "복습 모드",
    description: "틀린 문제를 다시 풀어봅니다",
    icon: "🔄",
  },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 0.2, label: "매우 쉬움", color: "bg-green-500" },
  { value: 0.4, label: "쉬움", color: "bg-green-400" },
  { value: 0.6, label: "보통", color: "bg-yellow-400" },
  { value: 0.8, label: "어려움", color: "bg-orange-400" },
  { value: 1.0, label: "매우 어려움", color: "bg-red-500" },
] as const;

/**
 * Subscription plans
 *
 * @deprecated Use SUBSCRIPTION_PLANS from '@/lib/stripe' instead
 * This provides the single source of truth for subscription plans with Stripe integration
 */

export const QUESTION_TYPES = [
  { id: "MCQ", name: "객관식", icon: "☑️" },
  { id: "READING", name: "독해", icon: "📖" },
  { id: "LISTENING", name: "듣기", icon: "🎧" },
  { id: "AUDIO", name: "오디오", icon: "🔊" },
  { id: "IMAGE", name: "이미지", icon: "🖼️" },
] as const;

export const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  gray: "#6b7280",
} as const;

export const DATE_RANGES = [
  { id: "week", label: "최근 7일", days: 7 },
  { id: "month", label: "최근 30일", days: 30 },
  { id: "quarter", label: "최근 3개월", days: 90 },
  { id: "year", label: "최근 1년", days: 365 },
  { id: "all", label: "전체", days: 99999 },
] as const;

export const APP_CONFIG = {
  name: "PrepTap",
  description: "AI 기반 영어 학습 플랫폼",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  supportEmail: "support@preptap.com",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  questionLimits: {
    free: 5,
    basic: 9999,
    pro: 9999,
    premium: 9999,
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
} as const;

export const BADGE_VARIANTS = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
} as const;
