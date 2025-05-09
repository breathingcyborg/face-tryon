"use client";

import ReactDOM from "react-dom";

export function PreloadResources() {
  const paths = [
    "/face_landmarker.task",
    "/new_3d/transformed/baseball_cap_ny_occluder.glb",
    "/new_3d/transformed/baseball_cap_ny.glb",
    "/new_3d/transformed/glasses.glb",
    "/new_3d/transformed/wizard_hat.glb",
    "/new_3d/transformed/wizard_hat_occluder.glb",
    "/new_3d/reference/ear_occluder.glb",
    "/previews/cap.png",
    "/previews/glasses.png",
    "/previews/wizard_hat.png",
  ];

  paths.forEach((p) => {
    ReactDOM.preconnect(p);
  });

  return null;
}
