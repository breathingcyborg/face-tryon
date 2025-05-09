"use client";

import { useEffect, useRef } from "react";

export const useRaf = (callback: (time: number) => void) => {
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (time: number) => {
      callback(time);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback]);
};
