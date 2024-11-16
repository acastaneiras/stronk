import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router-dom';

export default function WorkoutLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow w-full max-w-full lg:max-w-screen-lg mx-auto p-4">
        <Outlet />
      </div>
      <footer className="bg-gray-100 text-center p-4">
        <div className='flex flex-row justify-around gap-5'>
          <Button>
            Add Exercise
          </Button>
          <Button>
            Reorder Exercise
          </Button>
        </div>
      </footer>
    </main>
  );
}