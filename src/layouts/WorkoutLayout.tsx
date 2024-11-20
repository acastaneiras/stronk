import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function WorkoutLayout() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col w-full max-w-full lg:max-w-screen-lg mx-auto p-4">
        <Outlet />
      </div>
      <Separator />
      <footer className=" text-center p-4">
        <div className="flex flex-row items-center max-w-screen-lg m-auto">
          <Button className='w-full' onClick={() => { navigate("/training/exercise-list") }}>
            <Plus className='w-6 h-6' />
            Add Exercise
          </Button>
        </div>
      </footer>
    </main>
  );
}
