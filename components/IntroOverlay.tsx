import React, { useEffect, useState } from 'react';

interface IntroOverlayProps {
  onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Initial pause
    const t1 = setTimeout(() => setStage(1), 500);
    // Stage 2: Expand/Load
    const t2 = setTimeout(() => setStage(2), 2000);
    // Stage 3: Fade out
    const t3 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${stage === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative text-center">
        <div className={`text-6xl md:text-8xl font-black text-white tracking-tighter transition-all duration-1000 transform ${stage >= 1 ? 'scale-110 blur-sm opacity-0' : 'scale-100 opacity-100'}`}>
          Vibe<span className="text-orange-500">.</span>Coding
        </div>

        {/* Loading bar */}
        <div className="mt-8 w-48 h-1 bg-gray-800 mx-auto rounded-full overflow-hidden">
          <div className={`h-full bg-orange-500 transition-all duration-1000 ease-out ${stage >= 1 ? 'w-full' : 'w-0'}`} />
        </div>
      </div>
    </div>
  );
};

export default IntroOverlay;