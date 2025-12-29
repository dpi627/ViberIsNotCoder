import React, { useEffect, useState } from 'react';

interface DialogueBoxProps {
  text: string;
  isVisible: boolean;
  onComplete?: () => void;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ text, isVisible, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setDisplayedText('');
      setIsTyping(true);
      
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
      }, 30); // Typing speed

      return () => clearInterval(intervalId);
    } else {
      setDisplayedText('');
    }
  }, [text, isVisible, onComplete]);

  return (
    <div 
      className={`
        absolute bottom-2 left-4 right-4 md:left-32 md:right-12 lg:left-48 lg:right-20 
        bg-black/80 backdrop-blur-lg border border-white/20 
        text-white p-6 rounded-2xl shadow-2xl z-30
        transition-all duration-500 ease-out transform origin-bottom
        ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
      `}
    >
      <div className="flex flex-col space-y-2">
        <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Will 保哥</span>
        <p className={`text-lg md:text-xl leading-relaxed font-light ${isTyping ? 'typewriter-cursor' : ''}`}>
          {displayedText}
        </p>
      </div>
    </div>
  );
};

export default DialogueBox;