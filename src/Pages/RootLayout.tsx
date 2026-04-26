import { Outlet } from "react-router-dom";

export default function RootLayout() {
    return (
        <div className="bg-black h-screen w-screen text-white">
            <Outlet />
        </div>
    )
}