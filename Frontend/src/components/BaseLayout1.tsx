import { ReactNode } from "react";
import Sidebar1 from "./Sidebar1";

interface Props {
    children: ReactNode | ReactNode [];
}
export default function BaseLayout1({ children }: Props) {
    return (
    <div className="layout">
        <Sidebar1 /> 
        {children}
    </div>
    ) ;
}