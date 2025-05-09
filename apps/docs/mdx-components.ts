import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";
import { FC } from "react";

// Get the default MDX components
const themeComponents = getThemeComponents();

// Merge components
export function useMDXComponents(components: { [key: string]: FC }) {
  return {
    ...themeComponents,
    ...components,
  };
}
