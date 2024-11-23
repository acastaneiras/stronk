import { Outlet } from 'react-router-dom';

export default function ExerciseListLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <Outlet />
    </main>
  );
}