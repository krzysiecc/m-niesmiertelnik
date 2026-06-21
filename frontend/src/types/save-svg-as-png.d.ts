// Minimal type declaration for the untyped `save-svg-as-png` package.
declare module "save-svg-as-png" {
  export function saveSvgAsPng(
    el: SVGElement | null,
    fileName: string,
    options?: Record<string, unknown>,
  ): void;
}
