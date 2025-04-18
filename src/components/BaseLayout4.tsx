import { ReactNode } from "react";
import Sidebar4 from "./Sidebar4";

interface Props {
    readonly children: ReactNode | ReactNode [];
}
export default function BaseLayout4({ children }: Props) {
    return (
        <div className="flex h-screen">
        {/* Sidebar - only visible from md and up */}
        <div className="hidden md:block md:w-50 bg-[#012A4A]">
          <Sidebar4 />
        </div>
      
        {/* Main content */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    ) ;
}