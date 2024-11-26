import { Button } from '@/components/ui/button';
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';
import { useWorkoutStore } from '@/stores/workoutStore';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function WorkoutLayout() {
  const { setExerciseSearchMode } = useWorkoutStore();
  const navigate = useNavigate();

  const handleAddExercise = () => {
    setExerciseSearchMode(ExerciseSearchMode.ADD_EXERCISE);
    navigate("/training/exercise-list");
  }
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col w-full max-w-full lg:max-w-screen-lg mx-auto px-4 py-0">
        <Outlet />
      </div>
      <div className="sticky bottom-0 left-0 w-full bg-background text-center p-4 border-t border-border">
        <div className="flex flex-row items-center max-w-screen-lg mx-auto">
          <Button className='w-full' onClick={handleAddExercise}>
            <Plus className='w-6 h-6' />
            Add Exercise
          </Button>
        </div>
      </div>
    </main>
  );
}