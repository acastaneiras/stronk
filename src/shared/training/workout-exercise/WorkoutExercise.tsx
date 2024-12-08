import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExerciseHeader from '@/shared/training/workout-exercise/WorkoutExerciseHeader';
import WorkoutExerciseSets from '@/shared/training/workout-exercise/WorkoutExerciseSets';

type WorkoutExerciseProps = {
  id: number;
  currentExercise: WorkoutExerciseType;
  isViewing?: boolean;
  onChangeSetTypePress: (exerciseId: string | number[], index: number) => void;
  onCallExerciseNotes: () => void;
  onCallRemoveExercise: () => void;
  onCallRestTimeExercise: () => void;
  onCallShowIntensityModal: (exerciseId: string | number[], index: number) => void;
};

const WorkoutExercise = ({ id, currentExercise, isViewing = false, onChangeSetTypePress, onCallExerciseNotes, onCallRemoveExercise, onCallShowIntensityModal, onCallRestTimeExercise }: WorkoutExerciseProps) => {
  return (
    <div key={id} className='flex flex-col pb-4'>
      <WorkoutExerciseHeader
        index={id}
        isViewing={isViewing}
        currentExercise={currentExercise}
        onCallRemoveExercise={onCallRemoveExercise}
        onCallExerciseNotes={onCallExerciseNotes}
        onCallRestTimeExercise={onCallRestTimeExercise}
      />
      <div className="relative">
        <WorkoutExerciseSets
          isViewing={isViewing}
          currentExercise={currentExercise}
          onChangeSetTypePressEvent={onChangeSetTypePress}
          onCallShowIntensityModalEvent={onCallShowIntensityModal}
        />
      </div>
    </div>
  );
}

export default WorkoutExercise;