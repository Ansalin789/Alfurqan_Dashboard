'use client';

import { ReactNode, useEffect, useState } from "react";
import Sidebar1 from "./Sidebar1";

interface Props {
  readonly children: ReactNode | ReactNode[];
}

export default function BaseLayout1({ children }: Props) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const dpi = window.devicePixelRatio;

    // Map DPI to scale values
    if (dpi === 1.25) setScale(0.99);
    else if (dpi === 1.5) setScale(0.985);
    else if (dpi === 1.75) setScale(0.96);
    else if (dpi === 2) setScale(0.94);
    else setScale(1);
  }, []);

  const inverseScale = 1 / scale;

  return (
    <div
      style={{
        width: `100vw`,
        height: `100vh`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 * inverseScale}vw`,
          height: `${100 * inverseScale}vh`,
        }}
        className="flex"
      >
        {/* Sidebar - only visible from md and up */}
        <div className="hidden md:block w-[200px] bg-[#012A4A]">
          <Sidebar1 />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto py-2 px-4 scrollbar-none">
          {children}
        </div>
      </div>
    </div>
  );
}
