import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="relative h-screen w-screen bg-[url('/bg_auth.webp')] bg-cover bg-center">
            <div className="container mx-auto p-2 flex h-full w-full flex-col items-center justify-center relative z-10">
                <Outlet />
            </div>
        </div>
    );
}