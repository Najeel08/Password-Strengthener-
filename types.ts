export interface ComplianceCheck {
  name: string;
  code: string;
  passed: boolean;
  reason: string;
}

export interface CrackTime {
  onlineThrottling100PerHour: string;
  onlineNoThrottling10PerSecond: string;
  offlineSlowHashing1e4PerSecond: string;
  offlineFastHashing1e10PerSecond: string;
}

export interface PasswordAnalysis {
  score: 0 | 1 | 2 | 3 | 4;
  entropy: number;
  crackTimesDisplay: CrackTime;
  crackTimeSeconds: {
    offlineSlowHashing1e4PerSecond: number;
    offlineFastHashing1e10PerSecond: number;
  };
  feedback: {
    warning: string;
    suggestions: string[];
  };
  patterns: string[];
  compliance: ComplianceCheck[];
  charCount: number;
  label: string;
  color: string;
}

export enum StrengthLevel {
  Weak = 'Weak',
  Fair = 'Fair',
  Good = 'Good',
  Strong = 'Strong',
  VeryStrong = 'Very Strong',
}

export interface ZxcvbnResult {
  score: 0 | 1 | 2 | 3 | 4;
  guesses: number;
  guesses_log10: number;
  sequence: any[];
  feedback: {
    warning: string;
    suggestions: string[];
  };
  crack_times_display: CrackTime;
  crack_times_seconds: {
    online_throttling_100_per_hour: number;
    online_no_throttling_10_per_second: number;
    offline_slow_hashing_1e4_per_second: number;
    offline_fast_hashing_1e10_per_second: number;
  };
}