import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidUrl,
  isValidKoreanName,
  isValidScore,
  isValidAge,
  isValidPercentage,
  isEmpty,
  isNumeric,
  isAlphabetic,
  isAlphanumeric,
  isKorean,
  getPasswordStrength,
  validateEmailDomain,
  sanitizeInput,
  validateFileType,
  validateFileSize,
} from '../validation';

describe('Email Validation', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.kr')).toBe(true);
      expect(isValidEmail('test+tag@gmail.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('validateEmailDomain', () => {
    it('should validate allowed domains', () => {
      expect(validateEmailDomain('test@gmail.com', ['gmail.com', 'naver.com'])).toBe(true);
      expect(validateEmailDomain('user@naver.com', ['gmail.com', 'naver.com'])).toBe(true);
    });

    it('should reject disallowed domains', () => {
      expect(validateEmailDomain('test@yahoo.com', ['gmail.com', 'naver.com'])).toBe(false);
      expect(validateEmailDomain('test@example.com', ['gmail.com'])).toBe(false);
    });

    it('should handle invalid emails', () => {
      expect(validateEmailDomain('invalid', ['gmail.com'])).toBe(false);
    });
  });
});

describe('Password Validation', () => {
  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('Password123')).toBe(true);
      expect(isValidPassword('MyP@ssw0rd')).toBe(true);
      expect(isValidPassword('12345678a')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('short')).toBe(false); // Too short
      expect(isValidPassword('12345678')).toBe(false); // No letters
      expect(isValidPassword('abcdefgh')).toBe(false); // No numbers
      expect(isValidPassword('')).toBe(false); // Empty
    });
  });

  describe('getPasswordStrength', () => {
    it('should rate weak passwords', () => {
      const result = getPasswordStrength('12345678');
      expect(result.level).toBe('weak');
      expect(result.score).toBeLessThan(50);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should rate medium passwords', () => {
      const result = getPasswordStrength('Password1');
      expect(result.level).toBe('medium');
      expect(result.score).toBeGreaterThanOrEqual(50);
      expect(result.score).toBeLessThan(80);
    });

    it('should rate strong passwords', () => {
      const result = getPasswordStrength('MyP@ssw0rd123!');
      expect(result.level).toBe('strong');
      expect(result.score).toBeGreaterThanOrEqual(80);
    });

    it('should provide helpful feedback', () => {
      const weak = getPasswordStrength('abc');
      expect(weak.feedback).toContain('비밀번호는 최소 8자 이상이어야 합니다');

      const noNumber = getPasswordStrength('abcdefgh');
      expect(noNumber.feedback).toContain('숫자를 포함해주세요');

      const noUpper = getPasswordStrength('password123');
      expect(noUpper.feedback).toContain('대문자를 포함해주세요');
    });
  });
});

describe('Phone Number Validation', () => {
  it('should validate Korean mobile numbers', () => {
    expect(isValidPhoneNumber('010-1234-5678')).toBe(true);
    expect(isValidPhoneNumber('01012345678')).toBe(true);
  });

  it('should validate Korean landline numbers', () => {
    expect(isValidPhoneNumber('02-1234-5678')).toBe(true);
    expect(isValidPhoneNumber('0212345678')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(isValidPhoneNumber('123')).toBe(false);
    expect(isValidPhoneNumber('abc-def-ghij')).toBe(false);
    expect(isValidPhoneNumber('')).toBe(false);
  });
});

describe('URL Validation', () => {
  it('should validate correct URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://test.co.kr')).toBe(true);
    expect(isValidUrl('https://sub.domain.example.com/path')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('ftp://invalid')).toBe(false);
    expect(isValidUrl('')).toBe(false);
  });
});

describe('Korean Name Validation', () => {
  it('should validate Korean names', () => {
    expect(isValidKoreanName('김철수')).toBe(true);
    expect(isValidKoreanName('이영희')).toBe(true);
    expect(isValidKoreanName('박')).toBe(true);
  });

  it('should reject non-Korean names', () => {
    expect(isValidKoreanName('John')).toBe(false);
    expect(isValidKoreanName('Kim123')).toBe(false);
    expect(isValidKoreanName('김철수123')).toBe(false);
    expect(isValidKoreanName('')).toBe(false);
  });
});

describe('Score Validation', () => {
  it('should validate scores for different exam types', () => {
    expect(isValidScore(80, 'SUNEUNG')).toBe(true);
    expect(isValidScore(990, 'TOEIC')).toBe(true);
    expect(isValidScore(120, 'TOEFL')).toBe(true);
    expect(isValidScore(9, 'IELTS')).toBe(true);
  });

  it('should reject invalid scores', () => {
    expect(isValidScore(101, 'SUNEUNG')).toBe(false); // Max 100
    expect(isValidScore(991, 'TOEIC')).toBe(false); // Max 990
    expect(isValidScore(121, 'TOEFL')).toBe(false); // Max 120
    expect(isValidScore(10, 'IELTS')).toBe(false); // Max 9
    expect(isValidScore(-1)).toBe(false); // Negative
  });

  it('should handle default max score', () => {
    expect(isValidScore(100)).toBe(true);
    expect(isValidScore(101)).toBe(false);
  });
});

describe('Age Validation', () => {
  it('should validate valid ages', () => {
    expect(isValidAge(20)).toBe(true);
    expect(isValidAge(15)).toBe(true);
    expect(isValidAge(65)).toBe(true);
  });

  it('should reject invalid ages', () => {
    expect(isValidAge(4)).toBe(false); // Too young
    expect(isValidAge(130)).toBe(false); // Too old
    expect(isValidAge(-1)).toBe(false); // Negative
    expect(isValidAge(0)).toBe(false); // Zero
  });

  it('should handle custom min/max', () => {
    expect(isValidAge(10, 10, 20)).toBe(true);
    expect(isValidAge(9, 10, 20)).toBe(false);
    expect(isValidAge(21, 10, 20)).toBe(false);
  });
});

describe('Percentage Validation', () => {
  it('should validate valid percentages', () => {
    expect(isValidPercentage(0)).toBe(true);
    expect(isValidPercentage(50)).toBe(true);
    expect(isValidPercentage(100)).toBe(true);
  });

  it('should reject invalid percentages', () => {
    expect(isValidPercentage(-1)).toBe(false);
    expect(isValidPercentage(101)).toBe(false);
    expect(isValidPercentage(150)).toBe(false);
  });
});

describe('String Type Checks', () => {
  describe('isEmpty', () => {
    it('should detect empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\t\n')).toBe(true);
    });

    it('should detect non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty('  hello  ')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should validate numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('456.78')).toBe(true);
      expect(isNumeric('-123')).toBe(true);
    });

    it('should reject non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('12a')).toBe(false);
      expect(isNumeric('')).toBe(false);
    });
  });

  describe('isAlphabetic', () => {
    it('should validate alphabetic strings', () => {
      expect(isAlphabetic('hello')).toBe(true);
      expect(isAlphabetic('WORLD')).toBe(true);
      expect(isAlphabetic('HelloWorld')).toBe(true);
    });

    it('should reject non-alphabetic strings', () => {
      expect(isAlphabetic('hello123')).toBe(false);
      expect(isAlphabetic('hello world')).toBe(false);
      expect(isAlphabetic('안녕')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(isAlphanumeric('hello123')).toBe(true);
      expect(isAlphanumeric('ABC123')).toBe(true);
    });

    it('should reject non-alphanumeric strings', () => {
      expect(isAlphanumeric('hello-world')).toBe(false);
      expect(isAlphanumeric('test@123')).toBe(false);
    });
  });

  describe('isKorean', () => {
    it('should validate Korean strings', () => {
      expect(isKorean('안녕하세요')).toBe(true);
      expect(isKorean('한글')).toBe(true);
    });

    it('should reject non-Korean strings', () => {
      expect(isKorean('hello')).toBe(false);
      expect(isKorean('안녕hello')).toBe(false);
      expect(isKorean('123')).toBe(false);
    });
  });
});

describe('Input Sanitization', () => {
  it('should remove HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('');
    expect(sanitizeInput('<p>Hello</p>')).toBe('Hello');
    expect(sanitizeInput('Hello <b>World</b>!')).toBe('Hello World!');
  });

  it('should trim whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
    expect(sanitizeInput('\t\nhello\n\t')).toBe('hello');
  });

  it('should handle empty input', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput('   ')).toBe('');
  });
});

describe('File Validation', () => {
  describe('validateFileType', () => {
    it('should validate allowed file types', () => {
      expect(validateFileType('image.jpg', ['jpg', 'png', 'gif'])).toBe(true);
      expect(validateFileType('document.pdf', ['pdf', 'doc'])).toBe(true);
    });

    it('should reject disallowed file types', () => {
      expect(validateFileType('file.exe', ['jpg', 'png'])).toBe(false);
      expect(validateFileType('script.js', ['pdf', 'doc'])).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(validateFileType('IMAGE.JPG', ['jpg', 'png'])).toBe(true);
      expect(validateFileType('file.PDF', ['pdf'])).toBe(true);
    });

    it('should handle files without extension', () => {
      expect(validateFileType('noextension', ['jpg', 'png'])).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should validate files within size limit', () => {
      expect(validateFileSize(1024, 2048)).toBe(true); // 1KB < 2KB
      expect(validateFileSize(1024 * 1024, 5 * 1024 * 1024)).toBe(true); // 1MB < 5MB
    });

    it('should reject files exceeding size limit', () => {
      expect(validateFileSize(3000, 2048)).toBe(false); // 3KB > 2KB
      expect(validateFileSize(10 * 1024 * 1024, 5 * 1024 * 1024)).toBe(false); // 10MB > 5MB
    });

    it('should handle exact size limit', () => {
      expect(validateFileSize(2048, 2048)).toBe(true);
    });

    it('should reject negative sizes', () => {
      expect(validateFileSize(-1, 1024)).toBe(false);
    });
  });
});
