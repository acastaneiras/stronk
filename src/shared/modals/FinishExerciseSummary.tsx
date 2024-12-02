import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import IconSet from '@/shared/icons/IconSet';
import { useUserStore } from '@/stores/userStore';

const FinishExerciseSummary = ({ currentExercise }: { currentExercise: WorkoutExerciseType }) => {
  const {user} = useUserStore();
  return (
    <div className="my-2">
      <p className="text-lg font-semibold text-primary">{currentExercise.exercise.name}</p>
      {currentExercise.sets.map((set, index) => (
        <div key={index} className="flex items-center justify-start mb-2">
          <div className="mr-2">
            <IconSet setType={set.type} setNumber={set.number} size="sm" />
          </div>
          <p className="text-sm">
            {set.weight.value || 0} {set.weight.unit} x {set.reps || 0} {set.intensity ? `@ ${set.intensity.value.toFixed(1)} (${user?.intensitySetting.toUpperCase()})` : ''}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FinishExerciseSummary;
