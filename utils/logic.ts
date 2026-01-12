import { ComplianceCheck, PasswordAnalysis, ZxcvbnResult } from '../types';
import { COLORS } from '../constants';

// Helper to access zxcvbn from window if import fails (common in simple React setups without heavy bundler config for this specific lib)
// In a real app, strict import is preferred: import zxcvbn from 'zxcvbn';
declare global {
  interface Window {
    zxcvbn: (password: string) => ZxcvbnResult;
  }
}

const getZxcvbn = (): ((password: string) => ZxcvbnResult) => {
  if (window.zxcvbn) return window.zxcvbn;
  // Mock fallback if library fails to load to prevent crash, though functionality will be limited
  return (password: string) => ({
    score: password.length > 8 ? 2 : 0,
    guesses: 0,
    guesses_log10: 0,
    sequence: [],
    feedback: { warning: 'Library not loaded', suggestions: [] },
    crack_times_display: {
      onlineThrottling100PerHour: '?',
      onlineNoThrottling10PerSecond: '?',
      offlineSlowHashing1e4PerSecond: '?',
      offlineFastHashing1e10PerSecond: '?',
    },
    crack_times_seconds: {
      online_throttling_100_per_hour: 0,
      online_no_throttling_10_per_second: 0,
      offline_slow_hashing_1e4_per_second: 0,
      offline_fast_hashing_1e10_per_second: 0,
    }
  } as unknown as ZxcvbnResult);
};

const checkStandards = (password: string, result: ZxcvbnResult): ComplianceCheck[] => {
  const checks: ComplianceCheck[] = [];
  const len = password.length;
  
  // NIST SP 800-63B
  // Focus: Length >= 8, no composition rules required if strong, check against breached (simulated by zxcvbn score)
  checks.push({
    name: 'NIST SP 800-63B',
    code: 'NIST',
    passed: len >= 8 && result.score >= 2,
    reason: len < 8 ? 'Min length 8 required' : (result.score < 2 ? 'Too guessable' : 'Compliant'),
  });

  // OWASP Authentication
  // Focus: Length >= 10, Allow all chars, Block common lists
  checks.push({
    name: 'OWASP Top 10',
    code: 'OWASP',
    passed: len >= 10 && result.score >= 3,
    reason: len < 10 ? 'Min length 10 required' : (result.score < 3 ? 'Weak against dictionary attacks' : 'Compliant'),
  });

  // ENISA Guidelines
  // Focus: Complexity or high entropy.
  const hasMixed = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNum = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const complexity = (hasMixed ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);

  checks.push({
    name: 'ENISA Guidelines',
    code: 'ENISA',
    passed: len >= 12 || (len >= 8 && complexity >= 2),
    reason: 'Requires length 12+ or 8+ with complexity',
  });

  // ISO 27001 (Implied technical control)
  // Usually requires strict policy adherence. We simulate a typical corporate policy: 8 chars + complexity
  checks.push({
    name: 'ISO 27001',
    code: 'ISO',
    passed: len >= 8 && complexity >= 3,
    reason: 'Requires strong complexity (Upper, Lower, Number/Symbol)',
  });

  return checks;
};

export const analyzePassword = (password: string): PasswordAnalysis => {
  if (!password) {
    return {
      score: 0,
      entropy: 0,
      crackTimesDisplay: {
        onlineThrottling100PerHour: '-',
        onlineNoThrottling10PerSecond: '-',
        offlineSlowHashing1e4PerSecond: '-',
        offlineFastHashing1e10PerSecond: '-',
      },
      crackTimeSeconds: {
        offlineSlowHashing1e4PerSecond: 0,
        offlineFastHashing1e10PerSecond: 0,
      },
      feedback: { warning: '', suggestions: [] },
      patterns: [],
      compliance: [],
      charCount: 0,
      label: 'EMPTY',
      color: 'text-slate-500'
    };
  }

  const z = getZxcvbn();
  const result = z(password);
  
  // Calculate raw entropy approximation if not provided by zxcvbn directly
  // zxcvbn uses lg(guesses) which is essentially entropy in bits against the specific attack model
  const entropy = Math.round(Math.log2(result.guesses));

  const compliance = checkStandards(password, result);

  let label = 'Weak';
  let color = COLORS.WEAK;

  switch (result.score) {
    case 0: label = 'Very Weak'; color = COLORS.WEAK; break;
    case 1: label = 'Weak'; color = COLORS.WEAK; break;
    case 2: label = 'Fair'; color = COLORS.FAIR; break;
    case 3: label = 'Good'; color = COLORS.GOOD; break;
    case 4: label = 'Strong'; color = COLORS.STRONG; break;
  }
  
  // Override for very high entropy
  if (entropy > 100) {
    label = 'Excellent';
    color = COLORS.VERY_STRONG;
  }

  return {
    score: result.score,
    entropy: entropy < 0 ? 0 : entropy,
    crackTimesDisplay: result.crack_times_display,
    crackTimeSeconds: {
      offlineSlowHashing1e4PerSecond: result.crack_times_seconds.offline_slow_hashing_1e4_per_second,
      offlineFastHashing1e10PerSecond: result.crack_times_seconds.offline_fast_hashing_1e10_per_second,
    },
    feedback: result.feedback,
    patterns: result.sequence.map((s: any) => s.pattern),
    compliance,
    charCount: password.length,
    label,
    color,
  };
};

export const generateRandomPassword = (length = 16): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

export const generatePassphrase = (wordCount = 4): string => {
  const words = ['correct', 'horse', 'battery', 'staple', 'blue', 'sky', 'mountain', 'river', 'cosmic', 'nebula', 'proton', 'cyber', 'security', 'audit', 'zero', 'trust', 'crypto', 'ledger', 'vector', 'pixel'];
  let retVal = "";
  for (let i = 0; i < wordCount; ++i) {
      retVal += words[Math.floor(Math.random() * words.length)];
      if(i < wordCount - 1) retVal += "-";
  }
  return retVal;
};