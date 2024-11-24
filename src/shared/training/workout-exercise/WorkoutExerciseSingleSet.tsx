import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import { ExerciseSet } from '@/models/ExerciseSet';
import { Button } from '@/components/ui/button';
import IconSet from '@/shared/icons/IconSet';
import WeightInput from '@/shared/training/workout-exercise/workout-exercise-sets/WeightInput';
import RepsInput from './workout-exercise-sets/RepsInput';
import { Check } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import clsx from 'clsx';

type WorkoutExerciseSingleSetProps = {
  set: ExerciseSet;
  setIndex: number;
  currentExercise: WorkoutExerciseType;
  onChangeSetType: () => void;
};

function WorkoutExerciseSingleSet({ set, setIndex, currentExercise, onChangeSetType }: WorkoutExerciseSingleSetProps) {
  const { toggleSetCompletion } = useWorkoutStore();

  const handleSetCompleted = (setIndex: number) => {
    toggleSetCompletion(currentExercise.id, setIndex);
  }
  return (
    <div className={clsx("flex items-center text-center py-2 rounded", {"bg-primary/10": set.completed})}>
      <div className="w-1/5">
        <Button
          onClick={onChangeSetType}
          variant={`ghost`}
        >
          <IconSet setType={set.type} setNumber={set.number} ></IconSet>
        </Button>
      </div>
      <div className="w-1/5 md:px-10">
        <WeightInput
          set={set}
          setIndex={setIndex}
          currentExercise={currentExercise}
        /></div>
      <div className="w-1/5 md:px-10">
        <RepsInput
          set={set}
          setIndex={setIndex}
          currentExercise={currentExercise}
        />
      </div>
      <div className="w-1/5">
        <Button
          variant={`ghost`}
          onClick={() => console.log('Change RPE')}
          className="px-4 py-1 rounded"
        >
          {/*set.rpe */}
          1
        </Button>
      </div>

      <div className="w-1/5">
        <Button onClick={() => handleSetCompleted(setIndex)} variant={set.completed ? "default" : "outline"} >
            <Check className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

export default WorkoutExerciseSingleSet;
