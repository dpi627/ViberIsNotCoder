import React, { useEffect, useState } from 'react';
import { CharacterState, CharacterAnimation } from '../types';

interface CharacterProps {
  imageSrc: string;
  state: CharacterState;
  effectAnimation?: CharacterAnimation;
  onClick?: () => void;
}

// Map CharacterAnimation enum to CSS class names
const getEffectAnimationClass = (animation?: CharacterAnimation): string => {
  switch (animation) {
    case CharacterAnimation.BOUNCE:
      return 'animate-char-bounce';
    case CharacterAnimation.SPIN:
      return 'animate-char-spin';
    case CharacterAnimation.SHAKE:
      return 'animate-char-shake';
    case CharacterAnimation.JUMP:
      return 'animate-char-jump';
    case CharacterAnimation.WAVE:
      return 'animate-char-wave';
    case CharacterAnimation.PULSE:
      return 'animate-char-pulse';
    case CharacterAnimation.NONE:
    default:
      return '';
  }
};

const Character: React.FC<CharacterProps> = ({ imageSrc, state, effectAnimation, onClick }) => {
  const [currentEffect, setCurrentEffect] = useState<string>('');

  // Trigger effect animation when effectAnimation prop changes
  useEffect(() => {
    if (effectAnimation && effectAnimation !== CharacterAnimation.NONE) {
      const effectClass = getEffectAnimationClass(effectAnimation);
      setCurrentEffect(effectClass);

      // Clear effect after animation completes
      const timer = setTimeout(() => {
        setCurrentEffect('');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [effectAnimation]);

  // Determine CSS classes based on state
  const getTransformClass = () => {
    switch (state) {
      case CharacterState.RUNNING_LEFT:
        return 'scale-x-[-1] animate-run'; // Flip horizontally + bobbing
      case CharacterState.RUNNING_RIGHT:
        return 'scale-x-[1] animate-run'; // Normal + bobbing
      case CharacterState.IDLE:
        return 'animate-float'; // Gentle breathing/floating
      case CharacterState.HIDDEN:
        return 'opacity-0 scale-90';
      default:
        return '';
    }
  };

  const getTransitionClass = () => {
    // If we are running, we might want faster transitions, or none if controlled by parent frame
    return 'transition-all duration-300 ease-in-out';
  };

  return (
    <div
      onClick={onClick}
      className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 z-20 pointer-events-auto cursor-pointer ${getTransitionClass()} ${state === CharacterState.HIDDEN ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'}`}
    >
      {/* 
        Avatar Container Style:
        Since the image has a solid background (orange), we round it fully and add a border/shadow
        to make it look like a sticker or badge rather than a moving square box.
      */}
      <div className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl bg-orange-500 ${getTransformClass()} ${currentEffect}`}>
        <img
          src={imageSrc}
          alt="Character"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Character;