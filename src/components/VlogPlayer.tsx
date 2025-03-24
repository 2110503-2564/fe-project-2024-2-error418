"use client";
import { useRef } from "react";

export function VlogPlayer({ vdoSrc }: { vdoSrc: string }) {
  const vdoRef = useRef<HTMLVideoElement>(null);

  return (
    <video
      className="absolute fixed w-full object-cover"
      src={vdoSrc}
      ref={vdoRef}
      autoPlay
      loop
      muted
    />
  );
}
