// import { ReactNode } from "react";
// import Sidebar from "./Sidebar";

// interface Props {
//     children: ReactNode | ReactNode [];
// }
// export default function BaseLayout({ children }: Props) {
//     return (
//     <div className="layout">
//         <Sidebar /> 
//         {children}
//     </div>
//     ) ;
// }


import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface Props {
    children: ReactNode | ReactNode[];
    role: "teacher" | "academicCoach" | "Student"; // Define possible roles
}

export default function BaseLayout({ children, role }: Props) {
    return (
        <div className="layout">
            <Sidebar role={role} />
            <main className="content">{children}</main>
        </div>
    );
}
