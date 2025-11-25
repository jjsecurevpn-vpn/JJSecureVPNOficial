/**
 * @file FeatureCarousel.tsx
 * @description Componente reutilizable para mostrar características en formato carousel
 */

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { IconWithGlow, Text } from '../ui';
import { colors, spacing } from '../../constants/theme';

export interface FeatureSlideData {
  icon: React.ReactNode;
  title: string;
  description: string;
  image?: React.ReactNode;
}

export interface FeatureCarouselProps {
  features: FeatureSlideData[];
  autoSlide?: boolean;
  slideInterval?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Componente de slide individual (memo para optimización)
const FeatureSlide = memo(({ icon, title, description, image }: FeatureSlideData) => {
  return (
    <div className="text-center space-y-6 h-full flex flex-col justify-center">
      {/* Icono animado */}
      <div className="flex justify-center">
        {image || (
          <IconWithGlow
            icon={icon}
            glowColor="rgba(109, 74, 255, 0.15)"
            iconColor={colors.brand.soft}
            size={128}
          />
        )}
      </div>

      {/* Texto */}
      <div className="space-y-4">
        <Text variant="h3" color="primary" as="h3">
          {title}
        </Text>
        <Text 
          variant="body" 
          color="tertiary" 
          as="p"
          className="max-w-sm mx-auto"
        >
          {description}
        </Text>
      </div>
    </div>
  );
});
FeatureSlide.displayName = "FeatureSlide";

export const FeatureCarousel: React.FC<FeatureCarouselProps> = ({
  features,
  autoSlide = true,
  slideInterval = 5000,
  className = '',
  style = {},
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Distancia mínima para considerar un swipe
  const minSwipeDistance = 50;

  // Función de navegación del slider
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  }, [features.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  }, [features.length]);

  // Touch handlers para swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Auto-slide con pausa y respeto a reduced motion/visibility
  useEffect(() => {
    if (!autoSlide) return;
    
    const prefersReduced = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReduced || isPaused) return;

    let timeout: number | undefined;
    const tick = () => {
      timeout = window.setTimeout(() => {
        if (!document.hidden) nextSlide();
        tick();
      }, slideInterval);
    };
    tick();
    
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [nextSlide, isPaused, autoSlide, slideInterval]);

  const carouselStyle = {
    height: '320px',
    marginBottom: spacing['3xl'],
    ...style,
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{
        ...carouselStyle,
        overflow: 'hidden' // Contenedor principal con overflow hidden
      }}
      onMouseEnter={() => setIsPaused(true)} 
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={slideContainerRef}
        className="relative flex h-full items-center z-10"
        style={{ 
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: 'transform 250ms ease-in-out',
          willChange: 'transform'
        }}
      >
        {features.map((feature, index) => (
          <div 
            key={index}
            className="flex-shrink-0 w-full px-6 py-8"
            style={{ 
              willChange: 'transform'
            }}
          >
            <FeatureSlide {...feature} />
          </div>
        ))}
      </div>

      {/* Indicadores con diseño Proton */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="focus:outline-none focus:ring-2 focus:ring-white/40 rounded-full transition-all duration-200"
            style={{
              width: index === currentSlide ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: index === currentSlide ? colors.brand.primary : 'rgba(255, 255, 255, 0.3)',
              transition: 'all 200ms ease-in-out'
            }}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
