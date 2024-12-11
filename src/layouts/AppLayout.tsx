import BottomNavigation from '@/shared/sections/BottomNavigation';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <main className="min-h-screen flex flex-col pb-safe">
      <div className="flex-grow w-full max-w-full lg:max-w-screen-lg mx-auto p-4">
        <Outlet />
      </div>
      <BottomNavigation />
    </main>
  );
}