"use client";

import { useEffect, useMemo, useState } from "react";
import { FrameProvider } from "face-tryon-core";

export function useFrameDimensions(provider: FrameProvider | null) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const aspectRatio = useMemo(() => {
    const { width, height } = dimensions;
    return height !== 0 ? width / height : 4 / 3;
  }, [dimensions]);

  useEffect(() => {
    if (!provider) {
      return;
    }

    const onDimensionsChanged = () => {
      console.debug(
        `onDimensionsChanged ${provider.dimensions.width} x ${provider.dimensions.height}`,
      );
      setDimensions({ ...provider.dimensions });
    };

    provider.onDimensionsChanged(onDimensionsChanged);

    return () => {
      provider.offDimensionsChanged(onDimensionsChanged);
    };
  }, [provider]);

  return { ...dimensions, aspectRatio };
}
