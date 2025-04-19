import { ReactNode, useEffect, useState } from "react";
import Sidebar4 from "./Sidebar4";

interface Props {
  readonly children: ReactNode | ReactNode[];
}

export default function BaseLayout4({ children }: Props) {
  const [scaleStyle, setScaleStyle] = useState({});

  useEffect(() => {
    const dpi = window.devicePixelRatio;

    let scale = 1;

    // Set scale based on common DPI zoom levels
    if (dpi === 1.25) scale = 0.99;
    else if (dpi === 1.5) scale = 0.985;
    else if (dpi === 1.75) scale = 0.96;
    else if (dpi === 2) scale = 0.94;

    setScaleStyle({
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: `${100 / scale}%`,
      height: `${100 / scale}%`,
    });
  }, []);

  return (
    <div style={scaleStyle} className="flex h-screen">
      {/* Sidebar - only visible from md and up */}
      <div className="hidden md:block w-[200px] bg-[#012A4A]">
        <Sidebar4 />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto py-2 px-4 scrollbar-none">
        {children}
      </div>
    </div>
  );
}
