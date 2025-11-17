/**
 * Validation utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Minimum 8 characters, at least one letter and one number
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  return hasLetter && hasNumber;
}

/**
 * Get password strength level
 */
export function getPasswordStrength(password: string): {
  level: "weak" | "medium" | "strong";
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push("최소 8자 이상 입력하세요");
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("소문자를 포함하세요");
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push("대문자를 포함하세요");
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.push("숫자를 포함하세요");
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push("특수문자를 포함하세요");
  } else {
    score += 1;
  }

  let level: "weak" | "medium" | "strong" = "weak";
  if (score >= 4) {
    level = "strong";
  } else if (score >= 3) {
    level = "medium";
  }

  return { level, score, feedback };
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate phone number (Korean format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes;
}

/**
 * Validate date range
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return startDate <= endDate;
}

/**
 * Validate number in range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate string length
 */
export function isValidLength(
  str: string,
  min: number = 0,
  max: number = Infinity
): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * Check if string contains only alphanumeric characters
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Validate Korean name format
 */
export function isValidKoreanName(name: string): boolean {
  const koreanNameRegex = /^[가-힣]{2,4}$/;
  return koreanNameRegex.test(name);
}

/**
 * Validate username (alphanumeric, underscore, dash, 3-20 chars)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, "");

  if (!/^\d+$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate exam score (0-100 or specific ranges per exam type)
 */
export function isValidScore(score: number, examType?: string): boolean {
  if (score < 0) return false;

  const ranges: Record<string, number> = {
    SUNEUNG: 100,
    TOEIC: 990,
    TEPS: 600,
    TOEFL: 120,
    IELTS: 9,
  };

  const maxScore = examType && examType in ranges ? ranges[examType] : 100;
  return score <= maxScore;
}

/**
 * Validate difficulty level (0.0 - 1.0)
 */
export function isValidDifficulty(difficulty: number): boolean {
  return difficulty >= 0 && difficulty <= 1;
}

/**
 * Validate tags (no special characters, max length)
 */
export function isValidTag(tag: string): boolean {
  return /^[a-z0-9-]{1,50}$/.test(tag);
}

/**
 * Validate time limit (in minutes)
 */
export function isValidTimeLimit(minutes: number): boolean {
  return minutes > 0 && minutes <= 300; // Max 5 hours
}

/**
 * Validate question count
 */
export function isValidQuestionCount(count: number): boolean {
  return count >= 1 && count <= 100;
}

/**
 * Check if date is in the past
 */
export function isDateInPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if date is in the future
 */
export function isDateInFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Validate color hex code
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}
