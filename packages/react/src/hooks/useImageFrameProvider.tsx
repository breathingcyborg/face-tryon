"use client";

import { useEffect, useState } from "react";
import { ImageFrameProvider } from "face-tryon-core";

export function useImageFrameProvider() {
  const [provider, setProvider] = useState<ImageFrameProvider | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!image) {
        return;
      }
      const provider = new ImageFrameProvider(image);
      setProvider(provider);
    };
    init();
  }, [image]);

  return {
    image,
    setImage,
    provider,
  };
}
