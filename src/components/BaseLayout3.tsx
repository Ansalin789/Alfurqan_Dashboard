import { ReactNode } from "react";
import Sidebar3 from "./Sidebar3";

interface Props {
    children: ReactNode | ReactNode [];
}
export default function BaseLayout2({ children }: Props) {
    return (
    <div className="layout">
        <Sidebar3 /> 
        {children}
    </div>
    ) ;
}