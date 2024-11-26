import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExerciseHeader from '@/shared/training/workout-exercise/WorkoutExerciseHeader';
import WorkoutExerciseSets from '@/shared/training/workout-exercise/WorkoutExerciseSets';

type WorkoutExerciseProps = {
  id: number;
  currentExercise: WorkoutExerciseType;
  onChangeSetTypePress: (exerciseId: string | number[], index: number) => void;
  callExerciseNotes: () => void;
  callRemoveExercise: () => void;
};

const WorkoutExercise = ({ id, currentExercise, onChangeSetTypePress, callExerciseNotes, callRemoveExercise }: WorkoutExerciseProps) => {
  return (
    <div key={id} className='flex flex-col pb-4'>
      <WorkoutExerciseHeader
        index={id}
        currentExercise={currentExercise}
        callRemoveExercise={callRemoveExercise}
        callExerciseNotes={callExerciseNotes}
      />
      <div className="relative">
        <WorkoutExerciseSets
          currentExercise={currentExercise}
          onChangeSetTypePressEvent={onChangeSetTypePress}
        />
      </div>
    </div>
  );
}

export default WorkoutExercise;