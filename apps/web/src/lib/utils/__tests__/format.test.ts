import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDuration,
  formatFileSize,
  formatPhoneNumber,
  formatExamType,
  formatSchoolLevel,
  formatSessionMode,
  formatQuestionType,
  formatSubscriptionPlan,
  truncateText,
  capitalizeFirst,
  toKebabCase,
  toCamelCase,
  toPascalCase,
} from '../format';

describe('formatCurrency', () => {
  it('should format number as Korean currency', () => {
    expect(formatCurrency(10000)).toBe('₩10,000');
    expect(formatCurrency(1234567)).toBe('₩1,234,567');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('₩0');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-5000)).toBe('-₩5,000');
  });
});

describe('formatNumber', () => {
  it('should format numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('should handle decimals when specified', () => {
    expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
    expect(formatNumber(100.1, 1)).toBe('100.1');
  });
});

describe('formatPercentage', () => {
  it('should format decimal as percentage', () => {
    expect(formatPercentage(0.85)).toBe('85%');
    expect(formatPercentage(0.5)).toBe('50%');
  });

  it('should handle custom decimal places', () => {
    expect(formatPercentage(0.8567, 2)).toBe('85.67%');
    expect(formatPercentage(0.1234, 1)).toBe('12.3%');
  });

  it('should handle zero and one', () => {
    expect(formatPercentage(0)).toBe('0%');
    expect(formatPercentage(1)).toBe('100%');
  });
});

describe('formatDate', () => {
  it('should format date in Korean locale', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toContain('2024');
    expect(result).toContain('1');
    expect(result).toContain('15');
  });

  it('should handle string dates', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('2024');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return "방금 전" for recent times', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const recent = new Date('2024-01-15T11:59:50Z'); // 10 seconds ago
    expect(formatRelativeTime(recent)).toBe('방금 전');
  });

  it('should format minutes ago', () => {
    const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z');
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5분 전');
  });

  it('should format hours ago', () => {
    const twoHoursAgo = new Date('2024-01-15T10:00:00Z');
    expect(formatRelativeTime(twoHoursAgo)).toBe('2시간 전');
  });

  it('should format days ago', () => {
    const threeDaysAgo = new Date('2024-01-12T12:00:00Z');
    expect(formatRelativeTime(threeDaysAgo)).toBe('3일 전');
  });

  it('should format months ago', () => {
    const twoMonthsAgo = new Date('2023-11-15T12:00:00Z');
    expect(formatRelativeTime(twoMonthsAgo)).toBe('2달 전');
  });

  it('should format years ago', () => {
    const twoYearsAgo = new Date('2022-01-15T12:00:00Z');
    expect(formatRelativeTime(twoYearsAgo)).toBe('2년 전');
  });
});

describe('formatDuration', () => {
  it('should format seconds', () => {
    expect(formatDuration(45)).toBe('45초');
  });

  it('should format minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2분 5초');
    expect(formatDuration(60)).toBe('1분');
  });

  it('should format hours, minutes, and seconds', () => {
    expect(formatDuration(3665)).toBe('1시간 1분 5초');
    expect(formatDuration(7200)).toBe('2시간');
  });

  it('should handle zero', () => {
    expect(formatDuration(0)).toBe('0초');
  });
});

describe('formatFileSize', () => {
  it('should format bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB');
    expect(formatFileSize(1536)).toBe('1.50 KB');
  });

  it('should format megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.00 MB');
    expect(formatFileSize(5242880)).toBe('5.00 MB');
  });

  it('should format gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1.00 GB');
  });
});

describe('formatPhoneNumber', () => {
  it('should format 10-digit Korean phone numbers', () => {
    expect(formatPhoneNumber('0212345678')).toBe('02-1234-5678');
  });

  it('should format 11-digit mobile numbers', () => {
    expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
  });

  it('should return original if not valid format', () => {
    expect(formatPhoneNumber('123')).toBe('123');
  });
});

describe('formatExamType', () => {
  it('should format known exam types', () => {
    expect(formatExamType('SUNEUNG')).toBe('수능');
    expect(formatExamType('TOEIC')).toBe('TOEIC');
    expect(formatExamType('TEPS')).toBe('TEPS');
  });

  it('should return original for unknown types', () => {
    expect(formatExamType('UNKNOWN')).toBe('UNKNOWN');
  });
});

describe('Text formatting utilities', () => {
  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short';
      expect(truncateText(shortText, 20)).toBe('Short');
    });

    it('should use custom ellipsis', () => {
      const text = 'This is a long text';
      expect(truncateText(text, 10, '---')).toBe('This is a---');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('world')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('');
    });

    it('should not change already capitalized', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello');
    });
  });

  describe('Case conversion', () => {
    it('should convert to kebab-case', () => {
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });

    it('should convert to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
      expect(toCamelCase('Hello World')).toBe('helloWorld');
    });

    it('should convert to PascalCase', () => {
      expect(toPascalCase('hello-world')).toBe('HelloWorld');
      expect(toPascalCase('hello_world')).toBe('HelloWorld');
      expect(toPascalCase('hello world')).toBe('HelloWorld');
    });
  });
});

describe('formatSubscriptionPlan', () => {
  it('should format subscription plan names', () => {
    expect(formatSubscriptionPlan('FREE')).toBe('무료');
    expect(formatSubscriptionPlan('BASIC')).toBe('베이직');
    expect(formatSubscriptionPlan('PRO')).toBe('프로');
    expect(formatSubscriptionPlan('PREMIUM')).toBe('프리미엄');
  });

  it('should return original for unknown plans', () => {
    expect(formatSubscriptionPlan('UNKNOWN')).toBe('UNKNOWN');
  });
});
