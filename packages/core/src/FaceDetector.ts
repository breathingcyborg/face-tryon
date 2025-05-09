"use client";

import {
  Classifications,
  FaceLandmarker,
  FaceLandmarkerResult,
  FilesetResolver,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision-patched";
import { FrameProvider, FrameProviderType } from "./FrameProvider";

export type FaceDetectorOptions = {
  maxFaces?: number;
  modelPath?: string;
  wasmBasePath?: string;
};

export type FaceResult = {
  /**
   * Facemesh in 3D Space.
   */
  faceMesh?: {
    positions: number[];
    uvs: number[];
    indices: number[];
  };

  /**
   * Transformation matrix that can be applied to 3D objects
   * to align them with face.
   */
  transformationMatrix?: number[];

  /**
   * Face landmarks in normalized image coordinates.
   */
  normalizedLandmarks?: NormalizedLandmark[];

  /**
   * facial expressions confidence score
   */
  faceBlendShapes?: Classifications;
};

export class FaceDetector {
  protected fileResolver: FilesetResolver | null = null;
  protected faceLandmarker: FaceLandmarker | null = null;
  protected lastTimestamp: number | null = null;
  protected lastResults: FaceResult[] = [];

  constructor(protected frameProvider: FrameProvider) {}

  detectFaces(): FaceResult[] {
    if (!this.faceLandmarker) {
      return [];
    }

    const frame = this.frameProvider.getFrame();
    if (!frame) {
      return [];
    }

    const isVideo =
      this.frameProvider.type === "live_stream" ||
      this.frameProvider.type === "video";
    if (isVideo) {
      if (this.lastTimestamp === frame.timestamp) {
        return this.lastResults;
      }
      const results = transformResults(
        this.faceLandmarker.detectForVideo(frame.frame, performance.now()),
      );
      this.lastResults = results;
      return results;
    }

    const isImage = this.frameProvider.type === "image";
    if (isImage) {
      const results = transformResults(this.faceLandmarker.detect(frame.frame));
      this.lastResults = results;
      return results;
    }

    return [];
  }

  async initialize(options?: FaceDetectorOptions) {
    const wasmBasePath =
      options?.wasmBasePath ||
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm";

    const modelPath = options?.modelPath || "/face_landmarker.task";

    const runningMode = getRunningMode(this.frameProvider.type);

    const fileResolver = await FilesetResolver.forVisionTasks(wasmBasePath);
    this.fileResolver = fileResolver;

    const faceLandmarker = await FaceLandmarker.createFromOptions(
      fileResolver,
      {
        baseOptions: {
          modelAssetPath: modelPath,
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        numFaces: options?.maxFaces || 1,
        runningMode: runningMode,
      },
    );

    this.faceLandmarker = faceLandmarker;
  }
}

type Mesh3dRawProtobuf = {
  array: [number, number, number[], number[]];
};

function getRunningMode(frameProviderType: FrameProviderType) {
  return (
    {
      image: "IMAGE",
      video: "VIDEO",
      live_stream: "VIDEO",
    } as const
  )[frameProviderType];
}

function transformResults(results: FaceLandmarkerResult): FaceResult[] {
  const facesCount = results.faceLandmarks.length;
  const faces: FaceResult[] = [];

  for (let i = 0; i < facesCount; i++) {
    const transformationMatrix =
      results.facialTransformationMatrixes[i]?.data || [];

    const mesh = results.meshes[i] as Mesh3dRawProtobuf;
    const normalizedLandmarks = results.faceLandmarks[i];
    const faceBlendShapes = results.faceBlendshapes[i];

    const [vertexBuffer, indexBuffer] = [mesh.array[2], mesh.array[3]];
    const { positions, uvs } = extractInterleavedPositionsAndUvs(vertexBuffer);

    faces.push({
      faceMesh: {
        positions,
        uvs,
        indices: indexBuffer,
      },
      transformationMatrix,
      normalizedLandmarks,
      faceBlendShapes,
    });
  }

  return faces;
}

function extractInterleavedPositionsAndUvs(vertexBuffer: number[]) {
  // Positions are uvs are stored in same array
  const positions: number[] = [];
  const uvs: number[] = [];
  const vertexCount = vertexBuffer.length / 5;

  for (let i = 0; i < vertexCount; i++) {
    const srcBase = i * 5;
    positions[i * 3] = vertexBuffer[srcBase];
    positions[i * 3 + 1] = vertexBuffer[srcBase + 1];
    positions[i * 3 + 2] = vertexBuffer[srcBase + 2];

    uvs[i * 2] = vertexBuffer[srcBase + 3];
    uvs[i * 2 + 1] = vertexBuffer[srcBase + 4];
  }

  return { positions, uvs };
}
