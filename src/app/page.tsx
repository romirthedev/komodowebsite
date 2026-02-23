"use client";

import { DitheringShader } from "@/components/ui/dithering-shader";
import { GlowingEffect } from "@/components/ui/glowing-effect";
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
