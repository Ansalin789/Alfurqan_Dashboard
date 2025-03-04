import { ReactNode } from "react";
import Sidebar4 from "./Sidebar4";

interface Props {
    readonly children: ReactNode | ReactNode [];
}
export default function BaseLayout4({ children }: Props) {
    return (
    <div className="layout">
        <Sidebar4 /> 
        {children}
    </div>
    ) ;
}