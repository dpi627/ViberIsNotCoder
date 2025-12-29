import React from 'react';
import { CharacterState } from '../types';

interface CharacterProps {
  imageSrc: string;
  state: CharacterState;
}

const Character: React.FC<CharacterProps> = ({ imageSrc, state }) => {
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
      className={`relative w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 z-20 pointer-events-none ${getTransitionClass()} ${state === CharacterState.HIDDEN ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'}`}
    >
      {/* 
        Avatar Container Style:
        Since the image has a solid background (orange), we round it fully and add a border/shadow
        to make it look like a sticker or badge rather than a moving square box.
      */}
      <div className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl bg-orange-500 ${getTransformClass()}`}>
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