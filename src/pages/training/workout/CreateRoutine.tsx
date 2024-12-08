import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import useWorkoutActions from '@/hooks/useWorkoutActions';
import NotesModal from '@/shared/modals/NotesModal';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import RestTimeModal from '@/shared/modals/RestTimeModal';
import RIRModal from '@/shared/modals/RIRModal';
import RPEModal from '@/shared/modals/RPEModal';
import SetTypeModal from '@/shared/modals/SetTypeModal';
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise';
import { useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore } from '@/stores/workoutStore';
import { createRoutine } from '@/utils/apiCalls';
import { formatWeightDecimals, formatWeightUnit, getTotalSets, getTotalVolume } from '@/utils/workoutUtils';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Save, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import NoExercises from '../NoExercises';

const workoutSchema = z.object({
  title: z.string().min(1, { message: 'Routine title is required.' }),
});

const CreateRoutine = () => {
  const workoutStore = useWorkoutStore();
  const userStore = useUserStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const workoutActions = useWorkoutActions(workoutStore, userStore);

  const [removeExerciseOpen, setRemoveExerciseOpen] = useState(false);

  const setsDetail = getTotalSets(workoutStore.routine);
  const totalVolume = getTotalVolume(workoutStore.routine, true);

  useEffect(() => {
    if (workoutStore.storeMode !== StoreMode.ROUTINE) {
      workoutStore.setStoreMode(StoreMode.ROUTINE);
    }
  }, [workoutStore]);

  const handleSaveRoutine = async () => {
    if (!workoutStore.routine || !userStore.user) return;

    const routineData = { title: workoutStore.routine.title };
    const validation = workoutSchema.safeParse(routineData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    try {
      await createRoutine(workoutStore.routine, userStore.user);
      await queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast.success('Routine saved successfully!');
      workoutStore.emptyRoutine();
      navigate('/training');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between pt-4 relative">
          <div className="absolute left-0 w-10">
            <button onClick={() => navigate(-1)}>
              <ChevronLeft />
            </button>
          </div>
          <h1 className="text-xl font-bold tracking-tighter w-full text-center">New Routine</h1>
          <div className="absolute right-0 flex gap-2">
            <Button onClick={handleSaveRoutine}>
              <Save />
              <span className="hidden md:block">Save</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Routine title"
            className="w-full"
            value={workoutStore.routine?.title ?? ''}
            onChange={(e) => workoutStore.setRoutine({ ...workoutStore.routine!, title: e.target.value })}
          />
        </div>
        <div className="flex flex-row text-center justify-center gap-14 md:gap-24">
          <div>
            <div className="font-bold">Sets</div>
            <div>{setsDetail.total}</div>
          </div>
          <div>
            <div className="font-bold">Volume</div>
            <div>
              {formatWeightDecimals(totalVolume)} {userStore.user ? formatWeightUnit(userStore.user.unitPreference) : 'Kg'}
            </div>
          </div>
        </div>
        <Separator className="h-[2px]" />
      </div>

      <div className="flex flex-col flex-grow">
        {(!!workoutStore.routine && workoutStore.routine?.workout_exercises?.length > 0) ? (
          <ScrollArea type="always" className="flex-grow max-h-full h-1">
            <div className="flex flex-col gap-4 flex-grow pt-4">
              {workoutStore.routine?.workout_exercises.map((exercise, index) => (
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
            <NoExercises type="routine" />
          </div>
        )}
      </div>

      <ResponsiveModal
        open={removeExerciseOpen}
        onOpenChange={setRemoveExerciseOpen}
        dismissable={true}
        title="Remove Exercise"
        titleClassName="text-lg font-semibold leading-none tracking-tight"
        footer={
          <>
            <Button variant="destructive" onClick={workoutActions.handleRemoveExercise}>
              <Trash /> Confirm
            </Button>
            <Button variant="outline" onClick={() => setRemoveExerciseOpen(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <p>Are you sure you want to remove this exercise?</p>
      </ResponsiveModal>

      <RPEModal
        showRPEModal={workoutActions.showRPEModal}
        setShowRPEModal={workoutActions.setShowRPEModal}
        onSaveIntensity={workoutActions.handleSaveIntensity}
        onUnsetIntensity={workoutActions.handleUnsetIntensity}
        workout={workoutStore.routine}
        selectedSet={workoutActions.selectedSet}
      />
      <RIRModal
        showRIRModal={workoutActions.showRIRModal}
        setShowRIRModal={workoutActions.setShowRIRModal}
        onSaveIntensity={workoutActions.handleSaveIntensity}
        onUnsetIntensity={workoutActions.handleUnsetIntensity}
        workout={workoutStore.routine}
        selectedSet={workoutActions.selectedSet}
      />
      <NotesModal
        notesShown={workoutActions.showExerciseNotes}
        exerciseIndex={workoutActions.selectedExerciseIndex}
        setNotesShown={workoutActions.setShowExerciseNotes}
        changeNote={workoutActions.changeNoteEvent}
        workout={workoutStore.routine}
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
    </div>
  );
};

export default CreateRoutine;
