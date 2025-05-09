"use client";

import { FrameProvider, Frame } from "./FrameProvider";

export class CameraFrameProvider extends FrameProvider {
  protected cameraStream: MediaStream | null = null;

  constructor(private videoElement: HTMLVideoElement) {
    super("live_stream");
  }

  async initialize(constraints?: MediaStreamConstraints) {
    this.cameraStream = await navigator.mediaDevices.getUserMedia(
      constraints || {
        video: true,
      },
    );
    this.dimensions = { width: 0, height: 0 };
    this.videoElement.srcObject = this.cameraStream;
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
      frame: this.videoElement,
      timestamp: this.videoElement.currentTime,
      dimensions: dimensions,
    };
  }

  onDestroy() {
    this.cameraStream?.getTracks().forEach((track) => {
      track.stop();
    });
  }
}
