import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise';

type WorkoutExerciseViewProps = {
  id: number;
  currentExercise: WorkoutExerciseType;
};

const WorkoutExerciseView = ({ id, currentExercise }: WorkoutExerciseViewProps) => {
  const noCallback = () => { };

  return (
    <WorkoutExercise
      id={id}
      currentExercise={currentExercise}
      isViewing={true}
      onChangeSetTypePress={noCallback}
      onCallExerciseNotes={noCallback}
      onCallRemoveExercise={noCallback}
      onCallRestTimeExercise={noCallback}
      onCallShowIntensityModal={noCallback}
    />
  );
};

export default WorkoutExerciseView;