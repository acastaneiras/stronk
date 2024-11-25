import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExerciseHeader from '@/shared/training/workout-exercise/WorkoutExerciseHeader';
import WorkoutExerciseSets from '@/shared/training/workout-exercise/WorkoutExerciseSets';

type WorkoutExerciseProps = {
  id: number | undefined;
  currentExercise: WorkoutExerciseType;
  onChangeSetTypePress: (exerciseId: string | number[], index: number) => void;
  addNotesPress: () => void;
  callRemoveExercise: () => void;
};

const WorkoutExercise = ({ id, currentExercise, onChangeSetTypePress, addNotesPress, callRemoveExercise }: WorkoutExerciseProps) => {
  return (
    <div key={id} className='flex flex-col pb-4'>
      <WorkoutExerciseHeader
        currentExercise={currentExercise}
        addNotesEvent={addNotesPress}
        callRemoveExercise={callRemoveExercise}
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