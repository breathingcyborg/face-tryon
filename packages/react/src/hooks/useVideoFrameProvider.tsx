"use client";

import { useEffect, useState } from "react";
import { VideoFrameProvider } from "face-tryon-core";

export function useVideoFrameProvider() {
  const [provider, setProvider] = useState<VideoFrameProvider | null>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!video) {
        return;
      }
      const provider = new VideoFrameProvider(video);
      setProvider(provider);
    };
    init();
  }, [video]);

  return {
    video,
    setVideo,
    provider,
  };
}
