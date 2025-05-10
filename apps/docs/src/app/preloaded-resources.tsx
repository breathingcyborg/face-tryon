"use client";

import ReactDOM from "react-dom";

export function PreloadResources() {
  const paths = [
    "/face_landmarker.task",
    "/baseball_cap_ny_occluder.glb",
    "/baseball_cap_ny.glb",
    "/glasses.glb",
    "/wizard_hat.glb",
    "/wizard_hat_occluder.glb",
    "/ear_occluder.glb",
    "/previews/cap.png",
    "/previews/glasses.png",
    "/previews/wizard_hat.png",
  ];

  paths.forEach((p) => {
    ReactDOM.preconnect(p);
  });

  return null;
}
