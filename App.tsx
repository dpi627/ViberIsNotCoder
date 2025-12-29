import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Maximize, Minimize, Home } from 'lucide-react';
import { APP_CONFIG } from './constants';
import { CharacterState, CharacterAnimation } from './types';
import SlideContent from './components/SlideContent';
import Character from './components/Character';
import DialogueBox from './components/DialogueBox';
import IntroOverlay from './components/IntroOverlay';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Character and Dialogue States
  const [characterState, setCharacterState] = useState<CharacterState>(CharacterState.IDLE);
  const [showDialogue, setShowDialogue] = useState(false);
  const [characterEffect, setCharacterEffect] = useState<CharacterAnimation | undefined>(undefined);

  // Controls the visible position of the character wrapper (string for CSS value)
  // '8rem' moves the character slightly to the right, allowing for better overlap with the dialogue box.
  const [charPosition, setCharPosition] = useState('8rem');

  const timers = useRef<NodeJS.Timeout[]>([]);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Go back to first slide
  const handleGoHome = useCallback(() => {
    if (isTransitioning || currentSlideIndex === 0) return;

    setShowDialogue(false);
    clearTimers();
    setIsTransitioning(true);

    // Quick transition to first slide
    setCharacterState(CharacterState.RUNNING_LEFT);
    setCharPosition('-10rem');

    setTimeout(() => {
      setCurrentSlideIndex(0);
      setCharPosition('120%');

      setTimeout(() => {
        setCharPosition('8rem');
        setCharacterState(CharacterState.RUNNING_LEFT);

        setTimeout(() => {
          setCharacterState(CharacterState.IDLE);
          const firstSlide = APP_CONFIG.slides[0];
          if (firstSlide?.transition?.characterEffect) {
            setCharacterEffect(firstSlide.transition.characterEffect);
          }
          setIsTransitioning(false);
        }, 600);
      }, 50);
    }, 600);
  }, [currentSlideIndex, isTransitioning]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const requestTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  };

  const startDialogueCycle = useCallback(() => {
    clearTimers();
    // Delay initial show slightly for flow
    requestTimer(() => setShowDialogue(true), 500);
  }, [clearTimers]);

  // Initialize first slide logic or reset on slide change
  useEffect(() => {
    if (hasStarted && !isTransitioning) {
      startDialogueCycle();
    }
    // Cleanup on unmount or slide change
    return () => clearTimers();
  }, [hasStarted, isTransitioning, currentSlideIndex, startDialogueCycle, clearTimers]);

  const handleDialogueTypingComplete = useCallback(() => {
    // 1. Wait 3 seconds keeping it visible
    requestTimer(() => {
      setShowDialogue(false); // Fade out

      // 2. Wait 5 seconds then show again (Replay)
      requestTimer(() => {
        setShowDialogue(true); // Restart cycle
      }, 5000);

    }, 3000);
  }, [requestTimer]);

  const handleCharacterClick = useCallback(() => {
    if (isTransitioning) return;

    // Force immediate replay
    clearTimers();
    setShowDialogue(false);

    // Short delay to allow React to register the 'false' state so 'true' triggers re-typing
    setTimeout(() => {
      setShowDialogue(true);
    }, 50);
  }, [isTransitioning, clearTimers]);

  const handleNext = useCallback(() => {
    if (isTransitioning || currentSlideIndex >= APP_CONFIG.slides.length - 1) return;

    // 1. Hide dialogue & stop cycles
    setShowDialogue(false);
    clearTimers();
    setIsTransitioning(true);

    // 2. Character runs to the right
    setCharacterState(CharacterState.RUNNING_RIGHT);

    // Simulate movement duration
    setCharPosition('50%'); // Move to center

    setTimeout(() => {
      // 3. Change Slide
      setCurrentSlideIndex((prev) => prev + 1);

      // 4. Reset Character pos for entry
      setCharPosition('-10rem'); // Snap back to left edge (hidden or start)

      // Short delay for the slide render
      setTimeout(() => {
        setCharPosition('8rem'); // Run to resting spot

        // 5. Stop Character and trigger effect animation
        setTimeout(() => {
          setCharacterState(CharacterState.IDLE);
          // Trigger character effect animation if configured
          const nextSlide = APP_CONFIG.slides[currentSlideIndex + 1];
          if (nextSlide?.transition?.characterEffect) {
            setCharacterEffect(nextSlide.transition.characterEffect);
          }
          setIsTransitioning(false);
          // Effect will trigger startDialogueCycle
        }, 500);
      }, 50);
    }, 600);
  }, [currentSlideIndex, isTransitioning, clearTimers]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || currentSlideIndex <= 0) return;

    setShowDialogue(false);
    clearTimers();
    setIsTransitioning(true);

    // Character runs Left (backwards concept)
    setCharacterState(CharacterState.RUNNING_LEFT);
    setCharPosition('-10rem'); // Run off screen left

    setTimeout(() => {
      setCurrentSlideIndex((prev) => prev - 1);

      // Character enters from Right for continuity
      setCharPosition('120%');

      setTimeout(() => {
        setCharPosition('8rem'); // Run back to resting spot
        setCharacterState(CharacterState.RUNNING_LEFT); // Ensure facing left while running in

        setTimeout(() => {
          // Face forward (Right or Idle)
          setCharacterState(CharacterState.IDLE);
          // Trigger character effect animation if configured
          const prevSlide = APP_CONFIG.slides[currentSlideIndex - 1];
          if (prevSlide?.transition?.characterEffect) {
            setCharacterEffect(prevSlide.transition.characterEffect);
          }
          setIsTransitioning(false);
        }, 600);
      }, 50);

    }, 600);
  }, [currentSlideIndex, isTransitioning]);


  // Keydown listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!hasStarted) {
    return <IntroOverlay onComplete={() => setHasStarted(true)} />;
  }

  const currentSlide = APP_CONFIG.slides[currentSlideIndex];

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden flex flex-col">

      {/* 1. Slide Container */}
      <div className="absolute inset-0 z-0">
        <div key={currentSlide.id} className="w-full h-full animate-fadeIn">
          <SlideContent slide={currentSlide} isActive={!isTransitioning} />
        </div>
      </div>

      {/* 2. Character Layer */}
      <div
        className="absolute bottom-0 z-20 transition-all duration-700 ease-linear will-change-transform"
        style={{
          left: charPosition,
          transform: 'translateX(-50%)' // Center the container on the point
        }}
      >
        <Character
          imageSrc={APP_CONFIG.characterImage}
          state={characterState}
          effectAnimation={characterEffect}
          onClick={handleCharacterClick}
        />
      </div>

      {/* 3. Dialogue Layer (Independent of UI padding to sit flush at bottom) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <DialogueBox
          text={currentSlide.dialogue}
          isVisible={showDialogue && !isTransitioning}
          dialogueAnimation={currentSlide.transition?.dialogueStyle}
          onComplete={handleDialogueTypingComplete}
        />
      </div>

      {/* 4. Controls UI Layer (With Padding) */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 md:p-8">



        {/* Bottom Area: Controls Only */}
        <div className="relative w-full h-full pointer-events-none">

          {/* Navigation Controls (Side Buttons) */}
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-auto">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0 || isTransitioning}
              className={`p-3 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-md text-white transition-all transform hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            >
              <ChevronLeft size={40} />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-auto">
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === APP_CONFIG.slides.length - 1 || isTransitioning}
              className={`p-3 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-md text-white transition-all transform hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            >
              <ChevronRight size={40} />
            </button>
          </div>

          {/* Bottom Right: Fullscreen, Home Buttons + Slide Counter */}
          <div className="absolute bottom-0 right-0 pointer-events-auto flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <button
              onClick={toggleFullscreen}
              className="p-2 md:p-2.5 rounded-full bg-black/50 hover:bg-white/20 backdrop-blur-sm text-white transition-all transform hover:scale-110"
              title={isFullscreen ? '退出全螢幕' : '全螢幕'}
            >
              {isFullscreen ? <Minimize size={18} className="md:w-5 md:h-5" /> : <Maximize size={18} className="md:w-5 md:h-5" />}
            </button>
            <button
              onClick={handleGoHome}
              disabled={currentSlideIndex === 0 || isTransitioning}
              className="p-2 md:p-2.5 rounded-full bg-black/50 hover:bg-white/20 backdrop-blur-sm text-white transition-all transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
              title="回到首頁"
            >
              <Home size={18} className="md:w-5 md:h-5" />
            </button>
            <div className="text-white font-mono text-xs md:text-sm bg-black/50 px-2 py-1 md:px-3 rounded-full backdrop-blur-sm">
              SLIDE {currentSlideIndex + 1} / {APP_CONFIG.slides.length}
            </div>
          </div>

        </div>
      </div>

      {/* Scanline overlay effect for retro/modern feel */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
    </main>
  );
};

export default App;