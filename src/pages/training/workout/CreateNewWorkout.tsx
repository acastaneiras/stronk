import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import useWorkoutActions from '@/hooks/useWorkoutActions';
import { Routine } from '@/models/Workout';
import FinishWorkoutModal from '@/shared/modals/FinishWorkoutModal';
import NotesModal from '@/shared/modals/NotesModal';
import RemoveExerciseModal from '@/shared/modals/RemoveExerciseModal';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import RestTimeModal from '@/shared/modals/RestTimeModal';
import RIRModal from '@/shared/modals/RIRModal';
import RPEModal from '@/shared/modals/RPEModal';
import SetTypeModal from '@/shared/modals/SetTypeModal';
import ExerciseTimer from '@/shared/training/ExerciseTimer';
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise';
import WorkoutHeader from '@/shared/training/WorkoutHeader';
import { useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore } from '@/stores/workoutStore';
import { overwriteRoutine } from '@/utils/apiCalls';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NoExercises from '../NoExercises';

const CreateNewWorkout = () => {
  const workoutStore = useWorkoutStore();
  const userStore = useUserStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const workoutActions = useWorkoutActions(workoutStore, userStore);

  const [finishDrawerOpen, setFinishDrawerOpen] = useState(false);
  const [confirmSaveRoutineDialog, setConfirmSaveRoutineDialog] = useState(false);
  const [showIncompleteExerciseModal, setShowIncompleteExerciseModal] = useState(false);
  const [routineToChange, setRoutineToChange] = useState<{ routine: Routine; oldExerciseIds: string[] } | null>(null);

  useEffect(() => {
    if (workoutStore.storeMode !== StoreMode.WORKOUT) {
      workoutStore.setStoreMode(StoreMode.WORKOUT);
    }
  }, [workoutStore]);

  const handleOpenFinishDrawer = (showBeforeFinishModal: boolean) => {
    if (showBeforeFinishModal) {
      setShowIncompleteExerciseModal(true);
      return;
    }
    setFinishDrawerOpen(true);
  };

  const handleChangeRoutineTrigger = async ({ routine, oldExerciseIds }: { routine: Routine; oldExerciseIds: string[]; }) => {
    setConfirmSaveRoutineDialog(true);
    setRoutineToChange({ routine, oldExerciseIds });
  }

  const handleSaveRoutine = async (saveRoutine: boolean) => {
    if (!saveRoutine) {
      setConfirmSaveRoutineDialog(false);
      setRoutineToChange(null);
      workoutStore.emptyWorkout();
      toast.success('Workout saved successfully');
      navigate('/training');
      return;
    }
    if (!routineToChange || !userStore.user) return;
    try {
      //Calls the API to save the routine from the workout
      await overwriteRoutine(routineToChange, userStore.user);
      await queryClient.invalidateQueries({ queryKey: ['routines'], refetchType: 'all' });
      setConfirmSaveRoutineDialog(false);
      toast.success('Workout and Routine saved successfully');
      navigate('/training');
      workoutStore.emptyWorkout();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };


  return (
    <div className="flex flex-col flex-1">
      <WorkoutHeader onClose={handleGoBack} onFinish={handleOpenFinishDrawer} />
      <div className="flex flex-col flex-grow">
        {(!!workoutStore.workout && workoutStore.workout?.workout_exercises?.length > 0) ? (
          <ScrollArea type="always" className="flex-grow max-h-full md:h-1">
            <div className="flex flex-col gap-4 flex-grow pt-4">
              {workoutStore.workout?.workout_exercises.map((exercise, index) => (
                <WorkoutExercise
                  id={index}
                  key={`${exercise.id}-${index}`}
                  currentExercise={exercise}
                  onChangeSetTypePress={workoutActions.onChangeSetTypePress}
                  onCallExerciseNotes={() => workoutActions.handleExerciseNotes(index)}
                  onCallRemoveExercise={() => workoutActions.handleModalRemoveExercise(index)}
                  onCallShowIntensityModal={workoutActions.onCallShowIntensityModal}
                  onCallRestTimeExercise={() => workoutActions.handleRestTimeExercise(index)}
                />
              ))}
              <ExerciseTimer workoutExercises={workoutStore.workout.workout_exercises} />

            </div>
            <ScrollBar />
          </ScrollArea>
        ) : (
          <div className="m-auto">
            <NoExercises />
          </div>
        )}
      </div>
      <RemoveExerciseModal
        open={workoutActions.removeExerciseOpen}
        onOpenChange={workoutActions.setRemoveExerciseOpen}
        onConfirmRemove={workoutActions.handleRemoveExercise}
      />
      <RPEModal
        showRPEModal={workoutActions.showRPEModal}
        setShowRPEModal={workoutActions.setShowRPEModal}
        onSaveIntensity={workoutActions.handleSaveIntensity}
        onUnsetIntensity={workoutActions.handleUnsetIntensity}
        workout={workoutStore.workout}
        selectedSet={workoutActions.selectedSet}
      />
      <RIRModal
        showRIRModal={workoutActions.showRIRModal}
        setShowRIRModal={workoutActions.setShowRIRModal}
        onSaveIntensity={workoutActions.handleSaveIntensity}
        onUnsetIntensity={workoutActions.handleUnsetIntensity}
        workout={workoutStore.workout}
        selectedSet={workoutActions.selectedSet}
      />
      <NotesModal
        notesShown={workoutActions.showExerciseNotes}
        exerciseIndex={workoutActions.selectedExerciseIndex}
        setNotesShown={workoutActions.setShowExerciseNotes}
        changeNote={workoutActions.changeNoteEvent}
        workout={workoutStore.workout}
      />
      <SetTypeModal
        setTypeShown={workoutActions.setTypeShown}
        setSetTypeShown={workoutActions.setSetTypeShown}
        onChangeSetType={workoutActions.onChangeSetType}
      />
      <RestTimeModal
        showRestTime={workoutActions.showRestTime}
        setShowRestTime={workoutActions.setShowRestTime}
        handleSaveRestTime={workoutActions.handleSaveRestTime}
      />
      <FinishWorkoutModal open={finishDrawerOpen} onOpenChange={setFinishDrawerOpen} onChangedRoutine={handleChangeRoutineTrigger} />

      <ResponsiveModal
        open={showIncompleteExerciseModal}
        onOpenChange={setShowIncompleteExerciseModal}
        dismissable
        title="Incomplete Sets"
        titleClassName="text-lg font-semibold leading-none tracking-tight"
        footer={
          <Button variant="outline" onClick={() => setShowIncompleteExerciseModal(false)}>
            Dismiss
          </Button>
        }
      >
        <p>It appears you have some incomplete sets, please complete those sets before finishing the workout.</p>
      </ResponsiveModal>

      <ResponsiveModal
        open={confirmSaveRoutineDialog}
        onOpenChange={setConfirmSaveRoutineDialog}
        dismissable
        title="Save Routine Changes"
        titleClassName="text-lg font-semibold leading-none tracking-tight"
        footer={
          <>
            <Button onClick={() => handleSaveRoutine(true)}>
              <Save /> Confirm
            </Button>
            <Button variant="outline" onClick={() => handleSaveRoutine(false)}>
              No
            </Button>
          </>
        }
      >
        <p>Do you want to save the changes to the routine?</p>
      </ResponsiveModal>
    </div>
  );
}

export default CreateNewWorkout;
