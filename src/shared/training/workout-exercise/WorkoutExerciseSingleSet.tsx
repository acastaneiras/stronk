import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import { ExerciseSet } from '@/models/ExerciseSet';
import { Button } from '@/components/ui/button';

type WorkoutExerciseSingleSetProps = {
  set: ExerciseSet;
  setIndex: number;
  currentExercise: WorkoutExerciseType;
  onChangeSetType: () => void;
};

function WorkoutExerciseSingleSet({ set, setIndex, currentExercise, onChangeSetType }: WorkoutExerciseSingleSetProps) {
  return (
    <div className="flex items-center text-center py-2">
      <div className="w-1/5">
        <Button
          onClick={onChangeSetType}
          className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
        >
          {set.type} #{setIndex + 1}
        </Button>
      </div>
      <div className="w-1/5">{set.previous?.weight.value || '-'}</div>
      <div className="w-1/5">{set.weight.value}</div>
      <div className="w-1/5">{set.reps}</div>
      <div className="w-1/5">
        <Button
          onClick={() => console.log('Set completed')}
          className={`px-4 py-1 rounded ${set.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
        >
        </Button>
      </div>
    </div>
  );
}

export default WorkoutExerciseSingleSet;
