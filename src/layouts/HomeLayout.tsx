import { Outlet } from "react-router-dom";

function HomeLayout() {
  return (
    <main className="relative h-screen w-screen bg-[url('/home_background.webp')] bg-cover bg-center ">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-0"></div>
      <div className="container mx-auto p-2 flex h-full w-full flex-col items-center justify-center relative z-10">
        <Outlet />
      </div>
    </main>
  );
}

export default HomeLayout;
