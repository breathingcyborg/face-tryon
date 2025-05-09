"use client";

import { forwardRef, JSX, useMemo } from "react";
import { useFaceTransformMatrix } from "../hooks/useFaceTransformMatrix";
import {
  FaceResult,
  createExtendedFaceMeshGeometry,
  createFaceMeshGeometry,
} from "face-tryon-core";
import React from "react";
import { Mesh } from "three";

/**
 * @property {FaceResult} face
 * @property {boolean | undefined} extended - Would extend forehead if true
 * @default false
 * @property {number | undefined} centerScaleFactor - Scaling factor for center of forehead
 * @property {number | undefined} sidesScaleFactor - Scaling factor for center of forehead
 * @property {React.ReactNode} [children] - Custom material for the mesh.
 */
type FaceMeshProps = {
  face: FaceResult;
  extended?: boolean;
  centerScaleFactor?: number;
  sidesScaleFactor?: number;
  children?: React.ReactNode;
} & JSX.IntrinsicElements["mesh"];

export const FaceMesh = forwardRef<Mesh, FaceMeshProps>(
  (
    { face, extended, centerScaleFactor, sidesScaleFactor, children, ...props },
    ref,
  ) => {
    const { faceMesh } = face;

    const matrix = useFaceTransformMatrix(face);

    const geometry = useMemo(() => {
      if (!faceMesh) {
        return null;
      }
      if (!extended) {
        return createFaceMeshGeometry(faceMesh);
      }
      return createExtendedFaceMeshGeometry(
        faceMesh,
        centerScaleFactor,
        sidesScaleFactor,
      );
    }, [faceMesh, extended, centerScaleFactor, sidesScaleFactor]);

    if (!matrix || !geometry) {
      return null;
    }

    return (
      <mesh
        ref={ref}
        matrix={matrix}
        matrixAutoUpdate={false}
        geometry={geometry}
        {...props}
      >
        {children ? children : <meshNormalMaterial />}
      </mesh>
    );
  },
);
