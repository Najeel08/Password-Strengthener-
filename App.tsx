import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header, 
  PasswordInput, 
  StrengthMeter, 
  SecurityBadge, 
  CrackTimeCard, 
  StandardsPanel, 
  Recommendations,
  Card
} from './components/Components';
import { analyzePassword, generatePassphrase, generateRandomPassword } from './utils/logic';
import { PasswordAnalysis } from './types';
import { LEVELS } from './constants';

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<PasswordAnalysis>(analyzePassword(''));

  useEffect(() => {
    // Debounce the analysis slightly to avoid blocking main thread on every keystroke for very long passwords
    const timer = setTimeout(() => {
      setResult(analyzePassword(password));
    }, 50);
    return () => clearTimeout(timer);
  }, [password]);

  const handleGenerate = (type: 'random' | 'passphrase') => {
    const newPw = type === 'random' ? generateRandomPassword(16) : generatePassphrase(4);
    setPassword(newPw);
  };

  const levelData = useMemo(() => {
      if (password.length === 0) return LEVELS[0];
      return LEVELS[result.score];
  }, [result.score, password]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      <div className="max-w-7xl mx-auto">
        <Header systemOnline={true} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input and Detailed Stats */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Input Section */}
            <div className="relative">
              <PasswordInput 
                value={password} 
                onChange={setPassword} 
                onGenerate={handleGenerate} 
              />
              <div className="px-1">
                <StrengthMeter score={result.score} />
              </div>
            </div>

            {/* Crack Time Visualization */}
            <CrackTimeCard 
                seconds={result.crackTimeSeconds.offlineSlowHashing1e4PerSecond} 
                display={result.crackTimesDisplay.offlineSlowHashing1e4PerSecond}
            />

            {/* Warnings and Recommendations */}
            <Recommendations 
                warnings={result.feedback.warning} 
                suggestions={result.feedback.suggestions} 
            />
          </div>

          {/* Right Column: Badges and Compliance */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* The Big Badge */}
            <div className="h-full min-h-[300px]">
                <SecurityBadge 
                    score={result.score} 
                    entropy={result.entropy} 
                    charCount={result.charCount}
                    levelData={levelData}
                />
            </div>

            {/* Standards Compliance List */}
            <StandardsPanel checks={result.compliance} />
            
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-700 text-xs font-mono">
            SECURE CLIENT-SIDE ENCRYPTION • NO DATA TRANSMISSION • ZXCVBN ENGINE
        </footer>
      </div>
    </div>
  );
};

export default App;