import Footer from "@/shared/sections/Footer";
import { Outlet } from "react-router-dom";

function HomeLayout() {
    return (
        <div className="grid grid-rows-[1fr_auto] min-h-screen">
            <div className="max-w-96 p-2 mx-auto w-full">
                <Outlet />
            </div>
            <Footer></Footer>
        </div>
    );
}

export default HomeLayout;