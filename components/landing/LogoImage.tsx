"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoImageProps {
  src: string;
  width: number;
  height: number;
  fallback: React.ReactNode;
  alt?: string;
}

export function LogoImage({ src, width, height, fallback, alt = "ReVerie" }: LogoImageProps) {
  const [errored, setErrored] = useState(false);
  if (errored) return <>{fallback}</>;
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setErrored(true)}
      className="object-contain"
    />
  );
}
