import React, { useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';

const rand = (min: number, max: number): number => Math.random() * (max - min) + min;

const twinkle = keyframes`
  0% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.2; transform: scale(0.8); }
`;

const Container = styled.div`
  position: fixed;
  inset: 0; 
  pointer-events: none; 
  z-index: -1;
  background: radial-gradient(ellipse at top, #001022 0%, #00040a 60%);
  overflow: hidden;
`;

const StarsLayer = styled.div`
  position: absolute;
  inset: 0;
`;

interface StarProps {
  color?: string;
  duration?: number;
  delay?: number;
  reducedMotion?: boolean;
}

const Star = styled.div<StarProps>`
  position: absolute;
  border-radius: 50%;
  transform-origin: center;
  background: ${props => props.color || '#fff'};
  box-shadow: 0 0 6px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.06);
  will-change: opacity, transform;

  ${props => !props.reducedMotion && css`
    animation: ${twinkle} ${props.duration}s ease-in-out ${props.delay}s infinite;
  `}

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    opacity: 0.9;
    transform: none;
  }
`;

interface StarData {
  size: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
  opacity: number;
  blur: number;
}

interface StarfieldProps {
  count?: number;
  color?: string;
  speed?: number;
  density?: number;
}

export default function Starfield({ count = 120, color = '#ffffff', speed = 30, density = 1 }: StarfieldProps) {
  const stars: StarData[] = useMemo(() => {
    const arr = Array.from({ length: count }).map(() => {
      const size = rand(0.5, 3.5) * density; 
      const left = `${rand(0, 100)}%`;
      const top = `${rand(0, 100)}%`;
      const duration = rand(Math.max(1, speed * 0.2), Math.max(2, speed * 1.2));
      const delay = rand(0, duration);
      const opacity = rand(0.35, 1);
      const blur = rand(0, 1.6);
      return { size, left, top, duration, delay, opacity, blur };
    });
    return arr;
  }, [count, speed, density]);

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Container aria-hidden>
      <StarsLayer>
        {stars.map((s, i) => (
          <Star
            key={i}
            color={color}
            style={{
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              filter: `blur(${s.blur}px)`,
            }}
            duration={s.duration}
            delay={s.delay}
            reducedMotion={reducedMotion}
          />
        ))}
      </StarsLayer>
    </Container>
  );
}
