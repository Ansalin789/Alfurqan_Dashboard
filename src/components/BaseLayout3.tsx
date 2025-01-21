import { ReactNode } from "react";
import Sidebar3 from "./Sidebar3";

interface Props {
    readonly children: ReactNode | ReactNode [];
}
export default function BaseLayout3({ children }: Props) {
    return (
    <div className="layout">
        <Sidebar3 /> 
        {children}
    </div>
    ) ;
}