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
      let index = 0;
      
      const intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          index++;
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
        absolute bottom-8 left-4 right-4 md:left-20 md:right-20 lg:left-64 lg:right-64 
        bg-black/70 backdrop-blur-md border border-white/20 
        text-white p-6 rounded-2xl shadow-2xl z-30
        transition-all duration-500 ease-out transform origin-bottom
        ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
      `}
    >
      <div className="flex flex-col space-y-2">
        <span className="text-pink-400 text-xs font-bold uppercase tracking-widest">Guide</span>
        <p className={`text-lg md:text-xl leading-relaxed font-light ${isTyping ? 'typewriter-cursor' : ''}`}>
          {displayedText}
        </p>
      </div>
      
      {/* Decorative arrow */}
      <div className="absolute -left-2 bottom-6 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-black/70 border-b-[10px] border-b-transparent hidden lg:block" />
    </div>
  );
};

export default DialogueBox;