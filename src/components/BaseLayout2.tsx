import { ReactNode } from "react";
import Sidebar2 from "./Sidebar2";

interface Props {
    children: ReactNode | ReactNode [];
}
export default function BaseLayout2({ children }: Props) {
    return (
    <div className="layout">
        <Sidebar2 /> 
        {children}
    </div>
    ) ;
}