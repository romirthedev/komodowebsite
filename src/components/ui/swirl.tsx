"use client";

import { DitheringShader } from "./dithering-shader";

interface SwirlProps {
  colorBack?: string;
  colorFront?: string;
  pxSize?: number;
  speed?: number;
  className?: string;
}

export function Swirl({
  colorBack = "#0a0e14",
  colorFront = "#3cff3c",
  pxSize = 4,
  speed = 0.5,
  className = "",
}: SwirlProps) {
  return (
    <DitheringShader
      width={1920}
      height={1080}
      colorBack={colorBack}
      colorFront={colorFront}
      shape="swirl"
      type="8x8"
      pxSize={pxSize}
      speed={speed}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
