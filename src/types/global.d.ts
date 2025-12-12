// src/types/global.d.ts or src/global.d.ts

export {};

declare global {
  interface Window {
    google: any;
  }
}
declare interface HTMLVideoElement {
  captureStream?: (frameRate?: number) => MediaStream;
}

