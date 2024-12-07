import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FinishWorkoutModal from '@/shared/modals/FinishWorkoutModal';
import NotesModal from '@/shared/modals/NotesModal';
import RemoveExerciseModal from '@/shared/modals/RemoveExerciseModal';
import RestTimeModal from '@/shared/modals/RestTimeModal';
import RIRModal from '@/shared/modals/RIRModal';
import RPEModal from '@/shared/modals/RPEModal';
import SetTypeModal from '@/shared/modals/SetTypeModal';
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise';
import WorkoutHeader from '@/shared/training/WorkoutHeader';
import { useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore } from '@/stores/workoutStore';
import { useNavigate } from 'react-router-dom';
import NoExercises from '../NoExercises';
import useWorkoutActions from '@/hooks/useWorkoutActions';
import { useState, useEffect } from 'react';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';

const CreateNewWorkout = () => {
  const workoutStore = useWorkoutStore();
  const userStore = useUserStore();
  const navigate = useNavigate();

  const workoutActions = useWorkoutActions(workoutStore, userStore);

  const [finishDrawerOpen, setFinishDrawerOpen] = useState(false);
  const [confirmSaveRoutineDialog, setConfirmSaveRoutineDialog] = useState(false);
  const [showIncompleteExerciseModal, setShowIncompleteExerciseModal] = useState(false);

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

  const handleSaveRoutine = () => {
    console.log('Routine changes saved.');
    setConfirmSaveRoutineDialog(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col flex-1">
      <WorkoutHeader onClose={handleGoBack} onFinish={handleOpenFinishDrawer} />
      <div className="flex flex-col flex-grow">
        { (!!workoutStore.workout && workoutStore.workout?.workout_exercises?.length > 0) ? (
          <ScrollArea type="always" className="flex-grow max-h-full h-1">
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
      <FinishWorkoutModal open={finishDrawerOpen} onOpenChange={setFinishDrawerOpen} />

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

      <Dialog open={confirmSaveRoutineDialog} onOpenChange={setConfirmSaveRoutineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Routine Changes</DialogTitle>
          </DialogHeader>
          <p>Do you want to save the changes to the routine?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleSaveRoutine}>
              Confirm
            </Button>
            <Button variant="outline" onClick={() => setConfirmSaveRoutineDialog(false)}>
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateNewWorkout;
