"use client";

import { FrameProvider, Frame } from "./FrameProvider";

export class VideoFrameProvider extends FrameProvider {
  constructor(private videoElement: HTMLVideoElement) {
    super("video");
  }

  getFrame(): Frame | null {
    const isVideoReady = this.videoElement.readyState >= 1;
    if (!isVideoReady) {
      return null;
    }

    const dimensions = {
      width: this.videoElement.videoWidth,
      height: this.videoElement.videoHeight,
    };

    this.dimensions = dimensions;

    return {
      dimensions: dimensions,
      frame: this.videoElement,
      timestamp: this.videoElement.currentTime,
    };
  }
}
