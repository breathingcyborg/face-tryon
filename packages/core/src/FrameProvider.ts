"use client";

export type Dimensions = { width: number; height: number };

export interface Frame {
  frame: TexImageSource;
  timestamp: number | null;
  dimensions: { width: number; height: number };
}

export type FrameProviderType = "image" | "video" | "live_stream";

type VoidCallback = () => void;

export class FrameProvider {
  constructor(public type: FrameProviderType) {}

  private _dimensions = { width: 0, height: 0 };

  private dimensionsCallbacks: Set<VoidCallback> = new Set();

  get dimensions() {
    return this._dimensions;
  }

  set dimensions({ width, height }: { width: number; height: number }) {
    if (
      this._dimensions.width !== width ||
      this._dimensions.height !== height
    ) {
      this._dimensions.width = width;
      this._dimensions.height = height;
      this.dimensionsCallbacks.forEach((callback) => {
        callback();
      });
    }
  }

  getFrame(): Frame | null {
    throw new Error("Not implemented");
  }

  onDimensionsChanged(callback: VoidCallback) {
    this.dimensionsCallbacks.add(callback);
  }

  offDimensionsChanged(callback: VoidCallback) {
    this.dimensionsCallbacks.delete(callback);
  }
}
