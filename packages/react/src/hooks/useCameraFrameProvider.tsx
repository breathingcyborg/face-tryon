"use client";

import { useEffect, useState } from "react";
import { CameraFrameProvider } from "face-tryon-core";

export function useCameraFrameProvider(constrains?: MediaStreamConstraints) {
  const [provider, setProvider] = useState<CameraFrameProvider | null>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    let provider: CameraFrameProvider | null;

    const init = async () => {
      if (!video) {
        return;
      }
      provider = new CameraFrameProvider(video);
      await provider.initialize(constrains);
      setProvider(provider);
    };

    init();

    return () => {
      provider?.onDestroy();
    };
  }, [constrains, video]);

  return {
    video,
    setVideo,
    provider,
  };
}
