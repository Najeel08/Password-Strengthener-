import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Check, X, Copy, RefreshCw, Terminal, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { COLORS, BG_COLORS } from '../constants';

// --- Primitives ---

export const Card = ({ children, className, glow = false }: { children?: React.ReactNode; className?: string, glow?: boolean }) => (
  <div className={clsx(
    "relative bg-[#0F1623] border border-slate-800 rounded-lg p-6 overflow-hidden",
    glow && "shadow-[0_0_20px_rgba(6,182,212,0.05)]",
    className
  )}>
    {/* Tech lines background effect */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900/30 to-transparent opacity-50" />
    {children}
  </div>
);

export const IconButton = ({ onClick, icon: Icon, label, active = false }: { onClick?: () => void, icon: LucideIcon, label?: string, active?: boolean }) => (
  <button
    onClick={onClick}
    className={clsx(
      "p-2 rounded flex items-center justify-center transition-all duration-200 border",
      active 
        ? "bg-cyan-900/20 border-cyan-500/50 text-cyan-400" 
        : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500"
    )}
    title={label}
    aria-label={label}
  >
    <Icon size={18} />
  </button>
);

export const ActionButton = ({ onClick, label, icon: Icon, secondary = false }: { onClick: () => void, label: string, icon: LucideIcon, secondary?: boolean }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-200 border",
      secondary
        ? "bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
        : "bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
    )}
  >
    <Icon size={16} />
    {label}
  </button>
);

// --- Feature Components ---

interface HeaderProps {
  systemOnline: boolean;
}
export const Header = ({ systemOnline }: HeaderProps) => (
  <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-2">
    <div className="flex items-center gap-3 mb-4 md:mb-0">
      <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        <div className="w-6 h-6 border-2 border-cyan-400 rounded-t-full rounded-b-lg" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase font-sans">
          CyberLock <span className="text-cyan-400">Auditor</span>
        </h1>
        <p className="text-xs text-slate-500 tracking-[0.2em] font-mono uppercase">Privacy-First Security Engine</p>
      </div>
    </div>
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
      <div className={clsx("w-2 h-2 rounded-full animate-pulse", systemOnline ? "bg-emerald-500" : "bg-red-500")} />
      <span className="text-xs font-mono text-slate-400 uppercase">{systemOnline ? "System Online" : "System Offline"}</span>
    </div>
  </div>
);

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  onGenerate: (type: 'random' | 'passphrase') => void;
}
export const PasswordInput = ({ value, onChange, onGenerate }: PasswordInputProps) => {
  const [show, setShow] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <Card className="mb-6" glow>
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Target Password Analysis</h2>
      
      <div className="relative group mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Terminal size={20} className="text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter password to audit..."
          className="w-full bg-[#0B1120] border-2 border-slate-800 rounded text-slate-200 font-mono text-lg py-4 pl-12 pr-12 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all placeholder:text-slate-700"
          spellCheck={false}
        />
        <button
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-slate-300 transition-colors"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_auto] gap-3">
        <ActionButton onClick={() => onGenerate('random')} label="GEN RANDOM" icon={RefreshCw} />
        <ActionButton onClick={() => onGenerate('passphrase')} label="GEN PASSPHRASE" icon={Terminal} secondary />
        <div className="col-span-2 md:col-span-1">
          <IconButton onClick={copyToClipboard} icon={Copy} label="Copy to Clipboard" />
        </div>
      </div>
    </Card>
  );
};

interface StrengthMeterProps {
  score: number; // 0-4
}
export const StrengthMeter = ({ score }: StrengthMeterProps) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">
        <span>Weak</span>
        <span>Secure</span>
      </div>
      <div className="flex gap-1 h-3 w-full">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={clsx(
              "flex-1 rounded-sm transition-all duration-500",
              score >= level 
                ? (score < 2 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" 
                  : score < 3 ? "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                  : score < 4 ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]")
                : "bg-slate-800"
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
        <span>LVL 0</span>
        <span>LVL 1</span>
        <span>LVL 2</span>
        <span>LVL 3</span>
        <span>MAX</span>
      </div>
    </div>
  );
};

// --- Visualization Components ---

interface BadgeProps {
  score: number;
  entropy: number;
  charCount: number;
  levelData: { label: string; color: string; icon: LucideIcon; desc: string };
}
export const SecurityBadge = ({ score, entropy, charCount, levelData }: BadgeProps) => {
  const Icon = levelData.icon;
  
  return (
    <Card className="flex flex-col items-center justify-center text-center h-full">
      <div className={clsx(
        "w-24 h-24 rounded-full bg-slate-900 border-4 flex items-center justify-center mb-6 transition-colors duration-500 shadow-xl",
        score < 2 ? "border-red-900/50" : score < 4 ? "border-yellow-900/50" : "border-emerald-900/50"
      )}>
        <Icon size={48} className={clsx("transition-colors duration-500", levelData.color)} />
      </div>
      
      <h2 className={clsx("text-xl font-bold uppercase tracking-widest mb-2 transition-colors duration-500", levelData.color)}>
        {levelData.label}
      </h2>
      <p className="text-sm text-slate-500 font-mono mb-8 max-w-[240px]">
        {levelData.desc}
      </p>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-slate-900/50 border border-slate-800 rounded p-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Entropy</div>
          <div className="text-xl font-mono text-slate-200">{entropy} <span className="text-sm text-slate-500">bits</span></div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded p-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Length</div>
          <div className="text-xl font-mono text-slate-200">{charCount}</div>
        </div>
      </div>
    </Card>
  );
};

interface CrackTimeProps {
  seconds: number;
  display: string;
}
export const CrackTimeCard = ({ seconds, display }: CrackTimeProps) => {
  // Logarithmic scale for slider position: 0 to ~14 (trillions of years)
  // log10(seconds + 1). Max around 16 for 10^16 seconds
  const logVal = Math.max(0, Math.log10(seconds + 1));
  const maxLog = 15; // Cap at ~Quadrillion seconds
  const percentage = Math.min(100, (logVal / maxLog) * 100);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Estimated Time to Crack</h2>
        <div className="text-3xl font-bold text-slate-100 mb-1 break-words">
          {display}
        </div>
        <p className="text-xs text-slate-600 font-mono mb-6">Based on offline slow hashing scenario (bcrypt)</p>
      </div>

      <div className="relative pt-6 pb-2">
        {/* Timeline track */}
        <div className="h-1 bg-slate-800 w-full rounded relative">
            {/* Markers */}
            <div className="absolute top-0 left-0 w-full h-full flex justify-between text-[9px] text-slate-600 font-mono pt-3 uppercase">
                <span className="-translate-x-1/2">Instant</span>
                <span className="-translate-x-1/2">1 Hr</span>
                <span className="-translate-x-1/2">1 Day</span>
                <span className="-translate-x-1/2">1 Yr</span>
                <span className="-translate-x-1/2">Centuries</span>
            </div>
            {/* Ticks */}
            {[0, 0.23, 0.33, 0.5, 0.8].map((pos, i) => (
                <div key={i} className="absolute h-2 w-px bg-slate-700 -top-0.5" style={{ left: `${pos * 100}%` }} />
            ))}
        </div>

        {/* Indicator */}
        <motion.div 
            className="absolute top-0 -mt-1 w-1 h-6 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)] z-10"
            initial={{ left: '0%' }}
            animate={{ left: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 50 }}
        >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-cyan-900 text-cyan-200 text-[9px] px-2 py-0.5 rounded border border-cyan-700 whitespace-nowrap">
                You Are Here
            </div>
        </motion.div>
      </div>
    </Card>
  );
};

interface StandardsProps {
  checks: { name: string; passed: boolean; reason: string }[];
}
export const StandardsPanel = ({ checks }: StandardsProps) => (
  <Card>
    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
      <CheckCircle size={14} /> Standards Compliance
    </h2>
    <div className="space-y-3">
        {checks.map((check) => (
            <div key={check.name} className="flex items-center justify-between p-3 rounded bg-slate-900/50 border border-slate-800">
                <span className={clsx("text-sm font-medium", check.passed ? "text-slate-300" : "text-slate-500")}>
                    {check.name}
                </span>
                <div className="flex items-center gap-2">
                    {check.passed ? (
                         <Check size={16} className="text-emerald-500" />
                    ) : (
                        <X size={16} className="text-red-900" />
                    )}
                </div>
            </div>
        ))}
    </div>
    <div className="mt-4 text-[10px] text-slate-600 font-mono text-right">
        * Estimations based on standard dictionary attacks and complexity heuristics.
    </div>
  </Card>
);

interface RecsProps {
  warnings: string;
  suggestions: string[];
}
export const Recommendations = ({ warnings, suggestions }: RecsProps) => {
    if (!warnings && suggestions.length === 0) return null;

    return (
        <div className="mt-6 border border-yellow-900/30 bg-yellow-950/10 rounded-lg p-4 flex gap-4 items-start">
            <AlertTriangle className="text-yellow-600 shrink-0 mt-1" size={24} />
            <div>
                <h3 className="text-yellow-500 font-bold mb-1">Security Vulnerability Detected</h3>
                {warnings && <p className="text-yellow-600/80 text-sm mb-2 font-medium">{warnings}</p>}
                <ul className="list-disc pl-4 space-y-1">
                    {suggestions.map((s, i) => (
                        <li key={i} className="text-slate-400 text-sm">{s}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}