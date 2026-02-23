'use client';

import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  scrubSmooth?: number | boolean;
}

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'center center',
  wordAnimationEnd = 'center center',
  scrubSmooth = 1
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block" key={index} data-word>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current ?? window;
    const wordElements = el.querySelectorAll('[data-word]');

    // Create a timeline for smoother coordinated animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom-=10%',
        end: wordAnimationEnd,
        scrub: scrubSmooth,
      }
    });

    // Rotation animation on container
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: scrubSmooth
        }
      }
    );

    // Word opacity animation with stagger
    tl.fromTo(
      wordElements,
      {
        opacity: baseOpacity,
        willChange: 'opacity, filter'
      },
      {
        opacity: 1,
        stagger: 0.02,
        ease: 'none',
      },
      0
    );

    // Blur animation synced with opacity
    if (enableBlur) {
      tl.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          filter: 'blur(0px)',
          stagger: 0.02,
          ease: 'none',
        },
        0
      );
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength, scrubSmooth]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-relaxed font-semibold ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
