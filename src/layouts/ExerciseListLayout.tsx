import { Outlet } from 'react-router-dom';

export default function ExerciseListLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col w-full max-w-full lg:max-w-screen-lg mx-auto p-4 pt-0">
        <Outlet />
      </div>
    </main>
  );
}
