import { Button } from '@/components/ui/button';
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';
import { useWorkoutStore } from '@/stores/workoutStore';
import { Plus } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export default function ExerciseListLayout() {
  const { selectedExercises, exerciseSearchMode} = useWorkoutStore();

  const buttonText = () => {
    if (exerciseSearchMode === ExerciseSearchMode.REPLACE_EXERCISE as ExerciseSearchMode) {
      return `Replace Exercise`
    }
    return selectedExercises.length > 1 ? `Add ${selectedExercises.length} Exercises` : `Add ${selectedExercises.length ? `${selectedExercises.length} Exercise` : 'Exercise'}`
  }
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col w-full max-w-full lg:max-w-screen-lg mx-auto p-4 pt-0">
        <Outlet />
      </div>
      <div className="sticky bottom-0 left-0 w-full bg-background text-center p-4 border-t border-border">
        <div className="flex flex-row items-center max-w-screen-lg mx-auto">
          <Button className="w-full">
            <Plus className="w-6 h-6" />
             {buttonText() || 'Add Exercise'}
          </Button>
        </div>
      </div>
    </main>
  );
}