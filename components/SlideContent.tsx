import React from 'react';
import { SlideConfig, SlideType } from '../types';

interface SlideContentProps {
  slide: SlideConfig;
  isActive: boolean;
}

const SlideContent: React.FC<SlideContentProps> = ({ slide, isActive }) => {
  // Determine background class
  const bgClass = slide.backgroundColor || 'bg-gray-900';

  const renderContent = () => {
    switch (slide.type) {
      case SlideType.IMAGE:
        return (
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-black/20 z-10" /> {/* Dim overlay */}
            <img
              src={slide.content as string}
              alt="Slide"
              className="w-full h-full object-contain"
            />
          </div>
        );

      case SlideType.TEXT:
        return (
          <div className={`absolute inset-0 w-full h-full flex items-center justify-center ${bgClass}`}>
            <div className="max-w-4xl px-8 text-center z-10">
              {slide.title && (
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
                  {slide.title}
                </h1>
              )}
              <p className="text-xl md:text-3xl text-gray-100 leading-relaxed font-light">
                {slide.content as string}
              </p>
            </div>
            {/* Abstract BG elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        );

      case SlideType.HTML:
        return (
          <div className={`absolute inset-0 w-full h-full ${bgClass}`}>
            {slide.content as React.ReactNode}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default SlideContent;