'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import ColorThief from 'color-thief-browser';

interface FramedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const FramedImage = ({ src, alt }: FramedImageProps) => {
  const [bgColor, setBgColor] = useState<string>('#f0f0f0'); // Default frame color
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const extractColor = async () => {
      if (imgRef.current && imgRef.current.complete) {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(imgRef.current);
        setBgColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      }
    };

    if (imgRef.current) {
      if (imgRef.current.complete) {
        extractColor();
      } else {
        imgRef.current.onload = extractColor;
      }
    }
  }, [src]);

  return (
    <div
      className="shadow flex w-full h-full items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="rounded-lg w-[80] h-[80] bg-gray">
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          height={80}
          width={80}
          className="image rounded-lg border-5 border-white  shadow"
        />
      </div>
    </div>
  );
};
export default FramedImage;
