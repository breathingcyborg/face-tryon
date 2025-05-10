"use client";

import { forwardRef, useMemo } from "react";
import { useFaceTransformMatrix } from "../hooks/useFaceTransformMatrix";
import { deepCloneWithMaterial, FaceResult, makeOccluder } from "face-tryon-core";
import { Object3D } from "three";
import { ThreeElements } from "@react-three/fiber";

export type OccluderProps = {
  face: FaceResult;
  model: Object3D;
  // props for primitive
  // using ThreeElements['primitive'] & { face, model } fails
  // because ThreeElements['primitive'] is too broad and overrides face and model
  props: Omit<ThreeElements['primitive'], 'object'>
};

export const Occluder = forwardRef<Object3D, OccluderProps>(
  ({ face, model, props }, ref) => {
    const matrix = useFaceTransformMatrix(face);

    const occluderModel = useMemo(() => {
      const clone = deepCloneWithMaterial(model);
      return makeOccluder(clone);
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
