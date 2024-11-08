import Footer from "@/shared/sections/Footer";
import { Outlet } from "react-router-dom";

function HomeLayout() {
  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen bg-gradient-to-b from-blue-800 to-blue-400">
      <Outlet />
      <Footer />
    </div>
  );
}

export default HomeLayout;
