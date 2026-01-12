import { Shield, Lock, Skull, CheckCircle, AlertTriangle, Zap, Server, Globe } from 'lucide-react';

export const COLORS = {
  WEAK: 'text-red-500',
  FAIR: 'text-orange-500',
  GOOD: 'text-yellow-400',
  STRONG: 'text-cyan-400',
  VERY_STRONG: 'text-emerald-400',
};

export const BG_COLORS = {
  WEAK: 'bg-red-500',
  FAIR: 'bg-orange-500',
  GOOD: 'bg-yellow-400',
  STRONG: 'bg-cyan-400',
  VERY_STRONG: 'bg-emerald-400',
};

export const LEVELS = [
  { label: 'Script Kiddie Target', color: 'text-red-500', icon: Skull, desc: 'Widely available in breach databases.' },
  { label: 'Vulnerable', color: 'text-orange-500', icon: AlertTriangle, desc: 'Susceptible to basic dictionary attacks.' },
  { label: 'Moderate', color: 'text-yellow-400', icon: Lock, desc: 'Reasonable for low-risk accounts.' },
  { label: 'Secure', color: 'text-cyan-400', icon: Shield, desc: 'Standard protection for sensitive data.' },
  { label: 'Fortified', color: 'text-emerald-400', icon: Server, desc: 'Military-grade entropy detected.' },
];
