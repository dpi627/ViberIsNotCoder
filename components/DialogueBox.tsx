import React, { useEffect, useState } from 'react';
import { DialogueAnimation } from '../types';

interface DialogueBoxProps {
  text: string;
  isVisible: boolean;
  dialogueAnimation?: DialogueAnimation;
  onComplete?: () => void;
}

// Map DialogueAnimation enum to CSS class names
const getDialogueAnimationClass = (animation?: DialogueAnimation): string => {
  switch (animation) {
    case DialogueAnimation.FADE_IN:
      return 'animate-dialogue-fade';
    case DialogueAnimation.SLIDE_UP:
      return 'animate-dialogue-slide-up';
    case DialogueAnimation.POP:
      return 'animate-dialogue-pop';
    case DialogueAnimation.TYPEWRITER:
    case DialogueAnimation.NONE:
    default:
      return ''; // Default behavior with built-in transition
  }
};

const DialogueBox: React.FC<DialogueBoxProps> = ({ text, isVisible, dialogueAnimation, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Get animation class
  const animationClass = getDialogueAnimationClass(dialogueAnimation);

  useEffect(() => {
    if (isVisible) {
      setDisplayedText('');
      setIsTyping(true);
      // Increment key to restart animation
      setAnimationKey(prev => prev + 1);

      // Use a counter to track how many characters to slice
      // This is more robust than appending to previous state which can cause first char issues
      let charCount = 0;

      const intervalId = setInterval(() => {
        charCount++;
        if (charCount <= text.length) {
          setDisplayedText(text.slice(0, charCount));
        } else {
          clearInterval(intervalId);
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }, 60); // Typing speed

      return () => clearInterval(intervalId);
    }
  }, [text, isVisible, onComplete]);

  return (
    <div
      key={animationKey}
      className={`
        absolute bottom-4 sm:bottom-6 md:bottom-6 lg:bottom-3
        left-2 right-2 sm:left-auto sm:right-auto sm:left-24 md:left-36 lg:left-44 xl:left-52
        w-auto sm:w-fit max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-7rem)] md:max-w-[calc(100vw-12rem)] lg:max-w-[calc(100vw-14rem)]
        bg-black/50 sm:bg-black/30 backdrop-blur-lg border border-white/20 
        text-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-2xl z-30
        transition-all duration-500 ease-out transform origin-bottom-left
        ${isVisible ? `opacity-100 scale-100 translate-y-0 ${animationClass}` : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
      `}
    >
      <div className="flex flex-col space-y-1 sm:space-y-2">
        <span className="text-orange-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Will 保哥</span>
        <p className={`text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-light ${isTyping ? 'typewriter-cursor' : ''}`}>
          {displayedText}
        </p>
      </div>
    </div>
  );
};

export default DialogueBox;