import { Button } from '@/components/ui/button';
import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExerciseSingleSet from '@/shared/training/workout-exercise/WorkoutExerciseSingleSet';
import { useUserStore } from '@/stores/userStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { formatWeightUnit } from '@/utils/workoutUtils';
import { CheckCheckIcon, Hash, Plus, Weight, Zap } from 'lucide-react';
import { GoNumber } from "react-icons/go";


type WorkoutExerciseSetsProps = {
  currentExercise: WorkoutExerciseType;
  onChangeSetTypePressEvent: (exerciseId: string | number[], index: number) => void;
  onCallShowIntensityModalEvent: (exerciseId: string | number[], index: number) => void;
};

function WorkoutExerciseSets({ currentExercise, onChangeSetTypePressEvent, onCallShowIntensityModalEvent }: WorkoutExerciseSetsProps) {
  const { user } = useUserStore();
  const { addSetToExercise } = useWorkoutStore();

  return (
    <div>
      {currentExercise.sets.length > 0 && (
        <div className="grid grid-cols-5 text-center text-gray-500">
          <span className='flex gap-1 items-center justify-center'><Hash className='w-4' /> Set</span>
          <span className='flex gap-1 items-center justify-center'><Weight className='w-4' /> {user?.unitPreference && formatWeightUnit(user.unitPreference)}</span>
          <span className='flex gap-1 items-center justify-center'><GoNumber className='w-4' /> Reps</span>
          <span className='flex gap-1 items-center justify-center'><Zap className='w-4' />RPE</span>
          <span className='flex gap-1 items-center justify-center'><CheckCheckIcon className='w-4' /></span>
        </div>
      )}
      {currentExercise.sets.map((set, index) => (
        <WorkoutExerciseSingleSet
          key={index}
          set={set}
          setIndex={index}
          currentExercise={currentExercise}
          onChangeSetType={() => onChangeSetTypePressEvent(currentExercise.id, index)}
          callShowIntensityModal={() => onCallShowIntensityModalEvent(currentExercise.id, index)}
        />
      ))}
      <Button
        variant="secondary"
        onClick={() => addSetToExercise(currentExercise.id)}
        className="mt-4 px-4 py-2 w-full border"
      >
        <Plus className="h-6 w-6" />
        Add Set
      </Button>
    </div>
  );
}

export default WorkoutExerciseSets;
