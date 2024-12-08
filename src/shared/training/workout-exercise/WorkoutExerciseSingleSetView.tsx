import { ExerciseSet, IntensityScale } from '@/models/ExerciseSet';
import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import IconSet from '@/shared/icons/IconSet';
import WeightInput from '@/shared/training/workout-exercise/workout-exercise-sets/WeightInput';
import { useUserStore } from '@/stores/userStore';
import clsx from 'clsx';
import RepsInput from './workout-exercise-sets/RepsInput';

type WorkoutExerciseSingleSetViewProps = {
  set: ExerciseSet;
  setIndex: number;
  currentExercise: WorkoutExerciseType;
};

const WorkoutExerciseSingleSetView = ({ set, setIndex, currentExercise }: WorkoutExerciseSingleSetViewProps) => {
  const { user } = useUserStore();

  return (
    <div
      className="relative flex items-center text-center py-2 rounded">
      <div className={clsx(
        user?.intensitySetting !== "none" ? "w-1/4" : "w-1/3"
      )}>
        <IconSet setType={set.type} setNumber={set.number} />
      </div>
      <div className={clsx(
        user?.intensitySetting !== "none" ? "w-1/4" : "w-1/3",
        "px-1 md:px-10"
      )}>
        <WeightInput
          set={set}
          setIndex={setIndex}
          currentExercise={currentExercise}
          readOnly={true}
        />
      </div>
      <div className={clsx(
        user?.intensitySetting !== "none" ? "w-1/4" : "w-1/3",
        "px-1 md:px-10"
      )}>
        <RepsInput
          set={set}
          setIndex={setIndex}
          currentExercise={currentExercise}
          readOnly={true}
        />
      </div>
      {((user?.intensitySetting) && ([IntensityScale.RPE, IntensityScale.RIR].includes(user?.intensitySetting as IntensityScale))) && (
        <div className="w-1/4">
          <span
            className="px-4 py-1 rounded text-lg text-gray-500"
          >
            {set.intensity ? `@ ${set.intensity.value.toFixed(1)}` : "@"}
          </span>
        </div>
      )}
    </div>
  );
};

export default WorkoutExerciseSingleSetView;
