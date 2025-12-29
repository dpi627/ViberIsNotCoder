import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { APP_CONFIG } from './constants';
import { CharacterState } from './types';
import SlideContent from './components/SlideContent';
import Character from './components/Character';
import DialogueBox from './components/DialogueBox';
import IntroOverlay from './components/IntroOverlay';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Character and Dialogue States
  const [characterState, setCharacterState] = useState<CharacterState>(CharacterState.IDLE);
  const [showDialogue, setShowDialogue] = useState(false);
  // Controls the visible position of the character wrapper (for running effect)
  const [charPositionX, setCharPositionX] = useState(10); // Percent from left

  // Initialize first slide logic after intro
  useEffect(() => {
    if (hasStarted && !isTransitioning) {
      const timer = setTimeout(() => setShowDialogue(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning || currentSlideIndex >= APP_CONFIG.slides.length - 1) return;
    
    // 1. Hide dialogue
    setShowDialogue(false);
    setIsTransitioning(true);

    // 2. Character runs to the right
    setCharacterState(CharacterState.RUNNING_RIGHT);
    
    // Simulate movement duration
    // In a real game engine we'd calculate distance, here we just use timing
    setCharPositionX(50); // Move to center

    setTimeout(() => {
      // 3. Change Slide
      setCurrentSlideIndex((prev) => prev + 1);
      
      // 4. Reset Character pos for entry
      // We want the character to "keep running" or "run in" from left
      setCharPositionX(0); // Snap back to left edge (hidden or start)
      
      // Short delay for the slide render
      setTimeout(() => {
        setCharPositionX(10); // Run to resting spot
        
        // 5. Stop Character
        setTimeout(() => {
          setCharacterState(CharacterState.IDLE);
          setIsTransitioning(false);
        }, 500);
      }, 50);
    }, 600);
  }, [currentSlideIndex, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || currentSlideIndex <= 0) return;

    setShowDialogue(false);
    setIsTransitioning(true);

    // Character runs Left (backwards concept)
    setCharacterState(CharacterState.RUNNING_LEFT);
    setCharPositionX(-10); // Run off screen left

    setTimeout(() => {
      setCurrentSlideIndex((prev) => prev - 1);
      
      // Character enters from Right for continuity? Or just runs back in from left?
      // Let's have them run in from the right to simulate "going back"
      setCharPositionX(100); 
      
      setTimeout(() => {
        setCharPositionX(10);
        setCharacterState(CharacterState.RUNNING_LEFT); // Ensure facing left while running in

        setTimeout(() => {
          // Face forward (Right or Idle)
          setCharacterState(CharacterState.IDLE);
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
         {/* We can keep the previous slide in DOM for fade effect, but for simplicity we render current. 
             Ideally, use a key to force re-render animation. */}
         <div key={currentSlide.id} className="w-full h-full animate-fadeIn">
            <SlideContent slide={currentSlide} isActive={!isTransitioning} />
         </div>
      </div>

      {/* 2. Character Layer */}
      {/* The container moves using left/right percent to simulate position */}
      <div 
        className="absolute bottom-0 z-20 transition-all duration-700 ease-linear will-change-transform"
        style={{ 
          left: `${charPositionX}%`,
          transform: 'translateX(-50%)' // Center the container on the point
        }}
      >
        <Character 
          imageSrc={APP_CONFIG.characterImage} 
          state={characterState} 
        />
      </div>

      {/* 3. UI Overlay (Dialogue & Controls) */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 md:p-8">
        
        {/* Top Bar: Progress */}
        <div className="w-full flex justify-between items-start opacity-50 hover:opacity-100 transition-opacity pointer-events-auto">
          <div className="text-white font-mono text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            SLIDE {currentSlideIndex + 1} / {APP_CONFIG.slides.length}
          </div>
        </div>

        {/* Bottom Area: Controls & Dialogue */}
        <div className="relative w-full h-full pointer-events-none">
          
          {/* Dialogue (Independent of controls) */}
          <DialogueBox 
            text={currentSlide.dialogue} 
            isVisible={showDialogue && !isTransitioning} 
          />

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

        </div>
      </div>
      
      {/* Scanline overlay effect for retro/modern feel */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
    </main>
  );
};

export default App;