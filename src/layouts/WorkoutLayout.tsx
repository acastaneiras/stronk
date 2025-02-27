import { Button } from '@/components/ui/button';
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';
import { StoreMode, useWorkoutStore } from '@/stores/workoutStore';
import { ListOrderedIcon, Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function WorkoutLayout() {
  const { setExerciseSearchMode, workout, editingWorkout, routine, storeMode } = useWorkoutStore();
  const navigate = useNavigate();

  const handleAddExercise = () => {
    setExerciseSearchMode(ExerciseSearchMode.ADD_EXERCISE);
    navigate("/training/exercise-list");
  };

  const exercisesLength = (() => {
    switch (storeMode) {
      case StoreMode.WORKOUT:
        return workout?.workout_exercises?.length || 0;
      case StoreMode.EDIT_WORKOUT:
        return editingWorkout?.workout_exercises?.length || 0;
      case StoreMode.ROUTINE:
        return routine?.workout_exercises?.length || 0;
      default:
        return 0;
    }
  })();

  const isAddDisabled = (() => {
    switch (storeMode) {
      case StoreMode.WORKOUT:
        return !workout;
      case StoreMode.ROUTINE:
        return !routine;
      case StoreMode.EDIT_WORKOUT:
        return !editingWorkout;
      default:
        return true;
    }
  })();

  const isReorderDisabled = exercisesLength <= 1 || isAddDisabled;

  return (
    <main className="min-h-screen flex flex-col ">
      <div className="flex-grow flex flex-col w-full max-w-full lg:max-w-screen-lg mx-auto px-4 py-0 pb-safe">
        <Outlet />
      </div>
      <div className="sticky bottom-safe left-0 w-full bg-background text-center p-4 border-t border-border z-10">
        <div className="flex flex-row items-center max-w-screen-lg mx-auto gap-4">
          <Button
            className='w-full'
            onClick={handleAddExercise}
            disabled={isAddDisabled}
            aria-label={`add-workout-exercise`}
          >
            <Plus className='w-6 h-6' />
            Add Exercise
          </Button>
          <Button
            className='w-40 md:w-96'
            onClick={() => navigate("/training/reorder-exercises")}
            disabled={isReorderDisabled}
          >
            <ListOrderedIcon className='w-6 h-6' />
            Reorder Exercises
          </Button>
        </div>
      </div>
    </main>
  );
}