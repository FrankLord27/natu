"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { CldImage } from "next-cloudinary";
import styled from "styled-components";
import { ImageOff } from "lucide-react";

const FallbackWrapper = styled.div<{
  $width?: any;
  $height?: any;
  $fill?: boolean;
}>`
  width: ${(props) =>
    props.$fill ? "100%" : props.$width ? `${props.$width}px` : "100%"};
  height: ${(props) =>
    props.$fill ? "100%" : props.$height ? `${props.$height}px` : "100%"};
  background: #f8f8f8;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
`;

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

const SafeImage: React.FC<SafeImageProps> = (props) => {
  const { src, alt, width, height, fill, ...rest } = props;
  const [useStandardImg, setUseStandardImg] = useState(false);
  const [error, setError] = useState(false);

  // Detect if it's a Cloudinary asset (either full URL or public ID)
  // Public IDs usually don't have protocol/slashes if they are simple, but for safety:
  const isCloudinary =
    src.includes("res.cloudinary.com") ||
    (!src.startsWith("http") && !src.startsWith("/") && src.length > 2);

  // Re-check when src changes
  useEffect(() => {
    setUseStandardImg(false);
    setError(false);
  }, [src]);

  // If there was an error with next/image or CldImage, fallback to <img>
  if (error) {
    return (
      <div
        style={{
          position: "relative",
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
          borderRadius: "inherit",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || "Fallback product image"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: (rest.style?.objectFit as any) || "cover",
          }}
          onError={() => setUseStandardImg(true)}
        />
      </div>
    );
  }

  // If even <img> failed, show fallback icon
  if (useStandardImg) {
    return (
      <FallbackWrapper $width={width} $height={height} $fill={fill}>
        <ImageOff size={24} />
      </FallbackWrapper>
    );
  }

  // If it's a Cloudinary asset, use CldImage for max optimization
  if (isCloudinary) {
    // Extract public ID if it's a full URL
    const publicId = src.includes("res.cloudinary.com")
      ? src.split("/").pop()?.split(".")[0] || src
      : src;

    return (
      <CldImage
        {...props}
        src={publicId}
        alt={alt || "NaturaJM Elite Asset"}
        width={(width as any) || 800}
        height={(height as any) || 600}
        format="auto"
        quality="auto"
        crop={{
          type: "auto",
          source: true,
        }}
        onError={() => {
          console.warn(`SafeImage: CldImage failed for ${src}.`);
          setError(true);
        }}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt || "NaturaJM Product Image"}
      onError={() => {
        console.warn(
          `SafeImage: next/image failed for ${src}. Falling back to <img> tag.`,
        );
        setError(true);
      }}
    />
  );
};

export default SafeImage;
