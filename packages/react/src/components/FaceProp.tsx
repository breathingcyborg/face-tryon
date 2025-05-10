"use client";

import { forwardRef, useEffect, useMemo } from "react";
import { useFaceTransformMatrix } from "../hooks/useFaceTransformMatrix";
import { deepCloneWithMaterial, FaceResult } from "face-tryon-core";
import { isMesh } from "face-tryon-core";
import { Object3D, Object3DEventMap } from "three";
import { ThreeElements } from "@react-three/fiber";

type FacePropProps = {
  face: FaceResult;
  model: Object3D;
  // props for primitive
  // using ThreeElements['primitive'] & { face, model } fails
  // because ThreeElements['primitive'] is too broad and overrides face and model
  props: Omit<ThreeElements['primitive'], 'object'>
};

export const FaceProp = forwardRef<Object3D, FacePropProps>(
  ({ face, model, props }, ref) => {
    const matrix = useFaceTransformMatrix(face);

    const clone = useMemo(() => deepCloneWithMaterial(model), [model]);

    useEffect(() => {
      if (!clone) return;
      clone.traverse?.((child: Object3D<Object3DEventMap>) => {
        if (isMesh(child)) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((material) => {
            material.depthTest = true;
            material.depthWrite = true;
          });
        }
      });
    }, [clone]);

    if (!matrix) return null;

    return (
      <primitive
        renderOrder={2}
        ref={ref}
        matrix={matrix}
        matrixAutoUpdate={false}
        object={clone}
        {...props}
      />
    );
  },
);
