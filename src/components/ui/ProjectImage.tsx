"use client";

import Image from "next/image";

export default function ProjectImage({
  src,
  alt,
  fill,
  priority,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
