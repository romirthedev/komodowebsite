'use client';

import { useState, useEffect, useRef } from 'react';
import { GlowingEffect } from './glowing-effect';

interface Feature {
  id: string;
  tab: string;
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  terminalContent: {
    command: string;
    output: string[];
  };
  highlights: Array<{
    label: string;
    value: string;
    color?: 'green' | 'yellow' | 'blue';
  }>;
}

const features: Feature[] = [
  {
    id: 'detect',
    tab: 'DETECT',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    badge: 'HARDWARE',
    title: 'Automatic hardware detection',
    description: 'Komodo scans your system to identify GPU, CPU, and available accelerators. It then selects the optimal package versions for your specific hardware configuration.',
    terminalContent: {
      command: 'komodo detect',
      output: [
        '[HARDWARE DETECTION]',
        '',
        '  OS:           macOS 14.2 (Darwin)',
        '  Architecture: ARM64 (Apple Silicon)',
        '  CPU:          Apple M2 Pro (12 cores)',
        '  Memory:       32 GB',
        '  GPU:          Apple M2 Pro (19-core GPU)',
        '  Metal:        Supported ✓',
        '  CUDA:         Not available',
      ],
    },
    highlights: [
      { label: 'GPU Detected', value: 'M2 Pro 19-core', color: 'green' },
      { label: 'Accelerator', value: 'Metal MPS', color: 'blue' },
      { label: 'Optimization', value: 'ARM64 Native', color: 'yellow' },
    ],
  },
  {
    id: 'install',
    tab: 'INSTALL',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    badge: 'INTENT-BASED',
    title: 'Natural language installation',
    description: 'Describe what you want to build in plain English. Komodo parses your intent, resolves dependencies, and installs hardware-optimized packages automatically.',
    terminalContent: {
      command: 'komodo install "train a vision model"',
      output: [
        '[PARSING INTENT] "train a vision model"',
        '',
        'Detected requirements:',
        '  • Primary: Computer Vision / Deep Learning',
        '  • Runtime: Python 3.11',
        '  • Framework: PyTorch + torchvision',
        '',
        '[INSTALLING]',
        '  ✓ torch-2.1.0+metal',
        '  ✓ torchvision-0.16.0',
        '  ✓ pillow-10.1.0',
        '  ✓ opencv-python-4.8.1',
      ],
    },
    highlights: [
      { label: 'Packages', value: '12 installed', color: 'green' },
      { label: 'Conflicts', value: '0 detected', color: 'green' },
      { label: 'Time', value: '8.2 seconds', color: 'blue' },
    ],
  },
  {
    id: 'rollback',
    tab: 'ROLLBACK',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
    badge: 'SAFETY',
    title: 'Instant environment rollback',
    description: 'Every change creates a snapshot. Made a mistake or broke something? Roll back to any previous state instantly with a single command.',
    terminalContent: {
      command: 'komodo rollback --list',
      output: [
        '[AVAILABLE SNAPSHOTS]',
        '',
        '  #4  10 min ago   Added opencv, pillow',
        '  #3  2 hours ago  Installed pytorch, torchvision',
        '  #2  1 day ago    Installed numpy, pandas',
        '  #1  3 days ago   Initial environment',
        '',
        'Run: komodo rollback <id>',
        'Or:  komodo rollback (undo last)',
      ],
    },
    highlights: [
      { label: 'Snapshots', value: '4 available', color: 'blue' },
      { label: 'Storage', value: '124 MB', color: 'yellow' },
      { label: 'Restore time', value: '< 1 sec', color: 'green' },
    ],
  },
];

export default function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const activeFeature = features[activeIndex];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // How far we've scrolled into the section
      const scrolledIntoSection = -rect.top;
      const scrollableDistance = sectionHeight - viewportHeight;

      if (scrolledIntoSection < 0 || scrolledIntoSection > scrollableDistance) {
        return;
      }

      // Overall progress through the section (0 to 1)
      const totalProgress = scrolledIntoSection / scrollableDistance;
      setProgress(totalProgress);

      // Map to feature index
      const newIndex = Math.min(
        features.length - 1,
        Math.floor(totalProgress * features.length)
      );

      if (newIndex !== activeIndex && newIndex >= 0) {
        setActiveIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  // Calculate progress within current feature (0 to 1)
  const featureProgress = (progress * features.length) % 1;

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: `${features.length * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 pt-12 pb-4 md:px-12 lg:px-24">
            <p className="text-sm font-mono text-gray-500 mb-2">[01] FEATURES</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              How it works: <span className="text-[#98d998]">Intent + Hardware</span>
            </h2>
          </div>

          {/* Tabs */}
          <div className="px-6 md:px-12 lg:px-24 border-b border-white/10">
            <div className="flex gap-1">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-500 border-b-2 ${
                    activeIndex === index
                      ? 'text-[#98d998] border-[#98d998]'
                      : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  {feature.icon}
                  {feature.tab}
                </button>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 grid lg:grid-cols-2 gap-0">
            {/* Left: Terminal/Demo area with background */}
            <div className="relative bg-[#1a1f2e] overflow-hidden">
              {/* Diagonal stripes background pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 10px,
                    rgba(255,255,255,0.03) 10px,
                    rgba(255,255,255,0.03) 20px
                  )`,
                }}
              />

              {/* Terminal content */}
              <div className="relative h-full flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-lg">
                  {/* Terminal window */}
                  <div className="relative">
                    <GlowingEffect
                      spread={40}
                      glow={true}
                      disabled={false}
                      borderWidth={2}
                      autoRotate={true}
                      autoRotateSpeed={1}
                    />
                    <div className="relative bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      {/* Terminal Header */}
                      <div className="flex items-center gap-2 p-3 bg-[#161b22] border-b border-white/5">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-gray-500 font-mono ml-2">komodo</span>
                      </div>

                      {/* Terminal Content - crossfade between features */}
                      <div className="relative p-4 font-mono text-sm min-h-[300px]">
                        {features.map((feature, index) => (
                          <div
                            key={feature.id}
                            className="absolute inset-4 transition-opacity duration-500"
                            style={{
                              opacity: activeIndex === index ? 1 : 0,
                              pointerEvents: activeIndex === index ? 'auto' : 'none',
                            }}
                          >
                            <div className="flex gap-2 mb-3">
                              <span className="text-[#98d998]">~$</span>
                              <span className="text-white">{feature.terminalContent.command}</span>
                            </div>
                            <div className="text-gray-400 whitespace-pre-line leading-relaxed">
                              {feature.terminalContent.output.map((line, i) => (
                                <div key={i} className={line.startsWith('  ✓') ? 'text-[#98d998]' : ''}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Floating highlights - crossfade */}
                    <div className="absolute -right-2 lg:-right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                      {features.map((feature, fIndex) => (
                        <div
                          key={feature.id}
                          className="flex flex-col gap-2 absolute right-0 top-0 transition-opacity duration-500"
                          style={{
                            opacity: activeIndex === fIndex ? 1 : 0,
                            pointerEvents: activeIndex === fIndex ? 'auto' : 'none',
                          }}
                        >
                          {feature.highlights.map((highlight, i) => (
                            <div
                              key={i}
                              className={`px-3 py-2 rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm whitespace-nowrap ${
                                highlight.color === 'green'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : highlight.color === 'yellow'
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">{highlight.label}</div>
                              <div>{highlight.value}</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Description area */}
            <div className="relative flex items-center px-6 py-12 md:px-12 lg:px-16 bg-[#0a0e14]">
              {/* Content - crossfade between features */}
              <div className="relative w-full">
                {features.map((feature, index) => (
                  <div
                    key={feature.id}
                    className="transition-all duration-500"
                    style={{
                      opacity: activeIndex === index ? 1 : 0,
                      transform: activeIndex === index ? 'translateY(0)' : 'translateY(20px)',
                      position: activeIndex === index ? 'relative' : 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      pointerEvents: activeIndex === index ? 'auto' : 'none',
                    }}
                  >
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-gray-400 border border-white/10 mb-4">
                      {feature.badge}
                    </div>

                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                      {feature.title.split(' ').map((word, i) => {
                        const isHighlight = ['hardware', 'language', 'rollback', 'Automatic', 'Natural', 'Instant'].some(
                          (h) => word.toLowerCase().includes(h.toLowerCase())
                        );
                        return (
                          <span key={i}>
                            {isHighlight ? <span className="text-[#98d998]">{word}</span> : word}{' '}
                          </span>
                        );
                      })}
                    </h3>

                    <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-8">
                      {feature.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <button className="px-6 py-3 bg-[#98d998] text-[#0a0e14] font-semibold rounded-lg hover:bg-[#7bc97b] transition-colors">
                        Get Started
                      </button>
                      <button className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress indicator on the right edge */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? 'bg-[#98d998] scale-125'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
