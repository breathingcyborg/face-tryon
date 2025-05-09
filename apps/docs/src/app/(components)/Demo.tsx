"use client";

import { ReactNode, useState } from "react";
import { Button } from "nextra/components";

export function Demo({
  children,
  buttonText = "Show Demo",
  description,
}: {
  buttonText?: string;
  description?: string;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  if (visible) {
    return (
      <div
        className="nextra-border"
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          overflow: "clip",
          borderRadius: 20,
          margin: "1rem 0",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="nextra-border flex flex-col gap-4"
      style={{
        borderWidth: 1,
        borderStyle: "solid",
        width: "100%",
        minHeight: 500,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        margin: "1rem 0",
      }}
    >
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setVisible(true);
        }}
        variant="outline"
      >
        <span className="py-2 px-4 inline-block">{buttonText}</span>
      </Button>
      {description && <p className="max-w-sm text-center">{description}</p>}
    </div>
  );
}
