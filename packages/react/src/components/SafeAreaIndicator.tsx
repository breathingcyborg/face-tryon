import React from "react";

type SafeAreaIndicatorProps = {
  containerStyle?: React.CSSProperties;
  safeAreaStyle?: React.CSSProperties;
};

export function SafeAreaIndicator({
  containerStyle = {},
  safeAreaStyle = {},
}: SafeAreaIndicatorProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
        padding: 16,
        ...containerStyle,
      }}
    >
      <div
        style={{
          flexShrink: 1,
          width: "100%",
          height: "100%",
          maxWidth: "300px",
          border: "2px dashed rgba(0, 255, 0, 0.5)",
          borderRadius: "20px",
          ...safeAreaStyle,
        }}
      />
    </div>
  );
}
