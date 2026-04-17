"use client";

import Image from "next/image";
import { useState } from "react";

type FillProps = {
  variant: "fill";
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
};

type FixedProps = {
  variant: "fixed";
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
};

type Props = FillProps | FixedProps;

const placeholderFill = "absolute inset-0 bg-gradient-to-br from-ink-100 to-ink-200";
const placeholderBlock = "bg-gradient-to-br from-ink-100 to-ink-200";

export function RemoteCoverImage(props: Props) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    if (props.variant === "fill") {
      return <div className={placeholderFill} aria-hidden />;
    }
    return <div className={`${placeholderBlock} ${props.className ?? ""}`} aria-hidden />;
  }

  if (props.variant === "fill") {
    return (
      <Image
        src={props.src}
        alt={props.alt}
        fill
        className={props.className}
        sizes={props.sizes}
        unoptimized
        onError={() => setBroken(true)}
        priority={props.priority}
      />
    );
  }

  return (
    <Image
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      className={props.className}
      unoptimized
      onError={() => setBroken(true)}
      priority={props.priority}
      loading={props.loading}
    />
  );
}
