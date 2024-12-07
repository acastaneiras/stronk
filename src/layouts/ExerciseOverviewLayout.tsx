import { Outlet } from 'react-router-dom';

export default function ExerciseOverviewLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow w-full max-w-full lg:max-w-screen-lg mx-auto p-4">
        <Outlet/>
      </div>
    </main>
  );
}