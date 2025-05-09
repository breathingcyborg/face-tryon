"use client";

import { forwardRef, JSX, useMemo } from "react";
import { useFaceTransformMatrix } from "../hooks/useFaceTransformMatrix";
import { FaceResult, makeOccluder } from "face-tryon-core";
import { Object3D } from "three";

export type OccluderProps = {
  face: FaceResult;
  model: Object3D;
} & JSX.IntrinsicElements["primitive"];

export const Occluder = forwardRef<Object3D, OccluderProps>(
  ({ face, model, ...props }, ref) => {
    const matrix = useFaceTransformMatrix(face);

    const occluderModel = useMemo(() => {
      return makeOccluder(model);
    }, [model]);

    if (!matrix) return null;

    return (
      <primitive
        renderOrder={1}
        ref={ref}
        matrix={matrix}
        matrixAutoUpdate={false}
        object={occluderModel}
        {...props}
      />
    );
  },
);
