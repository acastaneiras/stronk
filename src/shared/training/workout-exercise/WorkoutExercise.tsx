import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExerciseHeader from '@/shared/training/workout-exercise/WorkoutExerciseHeader';
import WorkoutExerciseSets from '@/shared/training/workout-exercise/WorkoutExerciseSets';

type WorkoutExerciseProps = {
  id: number | undefined;
  handleOpenSettingsModal: () => void;
  currentExercise: WorkoutExerciseType;
  onChangeSetTypePress: (exerciseId: string | number[], index: number) => void;
  addNotesPress: () => void;
};

const WorkoutExercise = ({ id, handleOpenSettingsModal, currentExercise, onChangeSetTypePress, addNotesPress }: WorkoutExerciseProps) => {
  return (
    <div key={id} className='flex flex-col'>
      <WorkoutExerciseHeader
        currentExercise={currentExercise}
        openSettingsEvent={handleOpenSettingsModal}
        addNotesEvent={addNotesPress}
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