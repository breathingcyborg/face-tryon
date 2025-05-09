"use client";

import { FrameProvider, Frame } from "./FrameProvider";

export class ImageFrameProvider extends FrameProvider {
  constructor(private image: HTMLImageElement) {
    super("image");
  }

  getFrame(): Frame | null {
    const hasImageLoaded = this.image.naturalWidth > 0 && this.image.complete;
    if (!hasImageLoaded) {
      return null;
    }

    const dimensions = {
      width: this.image.naturalWidth,
      height: this.image.naturalHeight,
    };

    this.dimensions = dimensions;

    return {
      frame: this.image,
      dimensions: {
        width: this.image.naturalWidth,
        height: this.image.naturalHeight,
      },
      timestamp: null,
    };
  }
}
