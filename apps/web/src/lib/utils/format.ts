/**
 * Formatting utilities
 */

/**
 * Format a number as Korean currency (won)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a date in Korean format
 */
export function formatDate(date: Date | string, format: "short" | "long" | "relative" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "relative") {
    return formatRelativeTime(d);
  }

  const options: Intl.DateTimeFormatOptions = format === "long"
    ? { year: "numeric", month: "long", day: "numeric", weekday: "long" }
    : { year: "numeric", month: "numeric", day: "numeric" };

  return new Intl.DateTimeFormat("ko-KR", options).format(d);
}

/**
 * Format a date and time in Korean format
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format time duration in minutes and seconds
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}초`;
  }

  return `${minutes}분 ${seconds}초`;
}

/**
 * Format time duration in hours and minutes
 */
export function formatStudyTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}분`;
  }

  if (mins === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${mins}분`;
}

/**
 * Format a relative time (e.g., "2일 전", "방금 전")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "방금 전";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}주 전`;
  }

  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}개월 전`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years}년 전`;
}

/**
 * Format a large number with K, M suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }

  return num.toString();
}

/**
 * Truncate a string to a specified length
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  return `${str.substring(0, maxLength)}...`;
}

/**
 * Format a score with color based on value
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

/**
 * Format difficulty level to Korean
 */
export function formatDifficulty(difficulty: number): string {
  if (difficulty <= 0.2) return "매우 쉬움";
  if (difficulty <= 0.4) return "쉬움";
  if (difficulty <= 0.6) return "보통";
  if (difficulty <= 0.8) return "어려움";
  return "매우 어려움";
}

/**
 * Get color for difficulty level
 */
export function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 0.2) return "bg-green-500";
  if (difficulty <= 0.4) return "bg-green-400";
  if (difficulty <= 0.6) return "bg-yellow-400";
  if (difficulty <= 0.8) return "bg-orange-400";
  return "bg-red-500";
}

/**
 * Format exam type to Korean
 */
export function formatExamType(examType: string): string {
  const types: Record<string, string> = {
    SUNEUNG: "수능",
    TOEIC: "TOEIC",
    TEPS: "TEPS",
    TOEFL: "TOEFL",
    IELTS: "IELTS",
    CUSTOM: "맞춤형",
  };

  return types[examType] || examType;
}

/**
 * Format school level to Korean
 */
export function formatSchoolLevel(level: string): string {
  const levels: Record<string, string> = {
    ELEMENTARY: "초등학생",
    MIDDLE: "중학생",
    HIGH: "고등학생",
    UNIVERSITY: "대학생",
    ADULT: "직장인/일반",
  };

  return levels[level] || level;
}

/**
 * Convert milliseconds to readable time
 */
export function msToTime(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return singular;
  }

  return plural || `${singular}s`;
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
