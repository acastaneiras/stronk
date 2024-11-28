import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExerciseHeader from '@/shared/training/workout-exercise/WorkoutExerciseHeader';
import WorkoutExerciseSets from '@/shared/training/workout-exercise/WorkoutExerciseSets';

type WorkoutExerciseProps = {
  id: number;
  currentExercise: WorkoutExerciseType;
  onChangeSetTypePress: (exerciseId: string | number[], index: number) => void;
  onCallExerciseNotes: () => void;
  onCallRemoveExercise: () => void;
  onCallRestTimeExercise: () => void;
  onCallShowIntensityModal: (exerciseId: string | number[], index: number) => void;
};

const WorkoutExercise = ({ id, currentExercise, onChangeSetTypePress, onCallExerciseNotes, onCallRemoveExercise, onCallShowIntensityModal, onCallRestTimeExercise }: WorkoutExerciseProps) => {
  return (
    <div key={id} className='flex flex-col pb-4'>
      <WorkoutExerciseHeader
        index={id}
        currentExercise={currentExercise}
        onCallRemoveExercise={onCallRemoveExercise}
        onCallExerciseNotes={onCallExerciseNotes}
        onCallRestTimeExercise={onCallRestTimeExercise}
      />
      <div className="relative">
        <WorkoutExerciseSets
          currentExercise={currentExercise}
          onChangeSetTypePressEvent={onChangeSetTypePress}
          onCallShowIntensityModalEvent={onCallShowIntensityModal}
        />
      </div>
    </div>
  );
}

export default WorkoutExercise;