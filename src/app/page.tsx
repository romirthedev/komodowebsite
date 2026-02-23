"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { DitheringShader } from "@/components/ui/dithering-shader";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import KomodoTerminal from "@/components/ui/komodo-terminal";
import ScrollReveal from "@/components/ui/scroll-reveal";
import FeatureShowcase from "@/components/ui/feature-showcase";

const KOMODO_ART = `██╗  ██╗ ██████╗ ███╗   ███╗ ██████╗ ██████╗  ██████╗
██║ ██╔╝██╔═══██╗████╗ ████║██╔═══██╗██╔══██╗██╔═══██╗
█████╔╝ ██║   ██║██╔████╔██║██║   ██║██║  ██║██║   ██║
██╔═██╗ ██║   ██║██║╚██╔╝██║██║   ██║██║  ██║██║   ██║
██║  ██╗╚██████╔╝██║ ╚═╝ ██║╚██████╔╝██████╔╝╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ `;

const LINE_COLORS = [
  "#d4f5d4",
  "#c5eec5",
  "#b6e7b6",
  "#a7e0a7",
  "#98d998",
  "#89d289",
];

function GlowingCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-xl">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        borderWidth={2}
        autoRotate={true}
        autoRotateSpeed={1.5}
      />
      <div className="relative h-full rounded-xl border border-white/10 bg-[#0d1117] p-6">
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const lines = KOMODO_ART.split("\n");
  const terminalContainerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTerminalLocked, setIsTerminalLocked] = useState(false);
  const scrollAccumulator = useRef(0);
  const lastScrollY = useRef(0);

  // Scroll lock threshold - user must scroll this much to break out
  const SCROLL_THRESHOLD = 150;

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isTerminalLocked) return;

    // Only lock when scrolling down
    if (e.deltaY > 0) {
      e.preventDefault();
      scrollAccumulator.current += e.deltaY;

      // If user has scrolled enough, unlock and continue
      if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
        setIsTerminalLocked(false);
        scrollAccumulator.current = 0;
      }
    }
  }, [isTerminalLocked]);

  useEffect(() => {
    const handleScroll = () => {
      if (!terminalContainerRef.current) return;

      const rect = terminalContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress based on how far the section has scrolled up
      const startPoint = windowHeight * 0.5;
      const endPoint = 0;

      let progress = (startPoint - rect.top) / (startPoint - endPoint);
      progress = Math.max(0, Math.min(1, progress));

      // Only update state if progress actually changed (avoid unnecessary re-renders)
      setScrollProgress((prev) => {
        // Once we hit 1, don't update anymore to prevent scroll glitches in fullscreen terminal
        if (prev === 1 && progress >= 1) return prev;
        // Round to 2 decimal places to reduce update frequency
        const rounded = Math.round(progress * 100) / 100;
        if (rounded === prev) return prev;
        return rounded;
      });

      // Lock terminal when it becomes fullscreen
      if (progress >= 1 && !isTerminalLocked && window.scrollY > lastScrollY.current) {
        setIsTerminalLocked(true);
        scrollAccumulator.current = 0;
      }

      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTerminalLocked]);

  useEffect(() => {
    if (isTerminalLocked) {
      window.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isTerminalLocked, handleWheel]);

  return (
    <div className="min-h-screen w-full bg-[#0a0e14]">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Swirl Background */}
        <div className="absolute inset-0">
          <DitheringShader
            width={1920}
            height={1080}
            colorBack="#0a0e14"
            colorFront="#98d4a1"
            shape="swirl"
            type="8x8"
            pxSize={4}
            speed={0.5}
            style={{ width: "100vw", height: "100vh" }}
          />
        </div>

        {/* KOMODO Terminal Art */}
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <pre
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(8px, 2vw, 16px)",
              fontWeight: "bold",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {lines.map((line, i) => (
              <div key={i} style={{ color: LINE_COLORS[i] }}>
                {line}
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* What is Komodo Section */}
      <section className="relative z-10 px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            What is <span className="text-[#98d998]">Komodo</span>?
          </h2>
          <p className="text-lg leading-relaxed text-gray-300 md:text-xl">
            Komodo is an intelligent development environment setup tool that lets you describe
            what you want to build in <span className="text-[#98d998]">natural language</span>,
            rather than having to know specific package names, versions, or configuration details.
            It&apos;s like having an expert DevOps engineer who automatically configures your project
            based on your hardware and goals.
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
          <GlowingCard>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-400">
              Instead of this...
            </p>
            <pre className="overflow-x-auto text-sm text-gray-400">
{`pip install torch torchvision \\
  --index-url https://download.\\
  pytorch.org/whl/cu121
pip install transformers
pip install accelerate
# Hope versions are compatible...`}
            </pre>
          </GlowingCard>
          <GlowingCard>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#98d998]">
              You simply say...
            </p>
            <pre className="overflow-x-auto text-sm text-white">
{`komodo "train an AI model"

# Komodo detects your GPU,
# installs optimized packages,
# creates virtual environment,
# and handles all dependencies.`}
            </pre>
          </GlowingCard>
        </div>
      </section>

      {/* Interactive Terminal Section */}
      <section
        ref={terminalContainerRef}
        className="relative z-10"
        style={{ minHeight: "100vh" }}
      >
        {/* Sticky container - anchored to bottom */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-end pb-0">
          {/* Header text - fades out */}
          <div
            className="text-center mb-8 px-6 absolute top-24"
            style={{
              opacity: 1 - scrollProgress * 2,
              transform: `translateY(${-scrollProgress * 30}px)`,
              pointerEvents: scrollProgress > 0.3 ? "none" : "auto",
            }}
          >
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Try It <span className="text-[#98d998]">Yourself</span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-300 md:text-xl">
              Explore Komodo&apos;s commands in this interactive terminal.
            </p>
          </div>

          {/* Terminal - expands downward from top, bottom anchored to viewport bottom */}
          <div
            className="overflow-hidden"
            style={{
              width: `${50 + scrollProgress * 50}%`,
              maxWidth: "100vw",
              height: `${35 + scrollProgress * 65}vh`,
              borderRadius: `${12 * (1 - scrollProgress)}px ${12 * (1 - scrollProgress)}px 0 0`,
              transition: "none",
            }}
          >
            <KomodoTerminal />
          </div>
        </div>
      </section>

      {/* AI Revolution Section */}
      <section className="relative z-10 px-6 py-48 md:px-12 lg:px-24 min-h-screen flex items-center">
        <div className="mx-auto max-w-5xl text-center">
          <ScrollReveal
            baseOpacity={0.05}
            enableBlur={true}
            baseRotation={2}
            blurStrength={8}
            scrubSmooth={0.5}
            containerClassName="text-white"
            textClassName="text-[clamp(2rem,5vw,4rem)] leading-tight"
            wordAnimationEnd="center center+=100"
          >
            AI has Revolutionized Programming
          </ScrollReveal>
          <ScrollReveal
            baseOpacity={0.05}
            enableBlur={true}
            baseRotation={2}
            blurStrength={8}
            scrubSmooth={0.5}
            containerClassName="text-[#98d998] mt-2"
            textClassName="text-[clamp(2rem,5vw,4rem)] leading-tight"
            wordAnimationEnd="center center+=100"
          >
            Why are Dependencies stuck in 2018?
          </ScrollReveal>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <FeatureShowcase />

    </div>
  );
}
