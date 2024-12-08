import { Outlet } from 'react-router-dom';

export default function ViewWorkoutLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col w-full max-w-full lg:max-w-screen-lg mx-auto px-4 py-0">
        <Outlet />
      </div>
    </main>
  );
}