import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import useWorkoutActions from '@/hooks/useWorkoutActions';
import ErrorPage from '@/pages/ErrorPage';
import LoadingPage from '@/pages/LoadingPage';
import NotesModal from '@/shared/modals/NotesModal';
import RemoveExerciseModal from '@/shared/modals/RemoveExerciseModal';
import RestTimeModal from '@/shared/modals/RestTimeModal';
import RIRModal from '@/shared/modals/RIRModal';
import RPEModal from '@/shared/modals/RPEModal';
import SetTypeModal from '@/shared/modals/SetTypeModal';
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise';
import { useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore } from '@/stores/workoutStore';
import { editRoutine, fetchRoutineById } from '@/utils/apiCalls';
import { formatWeightDecimals, formatWeightUnit, getTotalSets, getTotalVolume, validateWorkoutInputs } from '@/utils/workoutUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import NoExercises from '../NoExercises';
import { validate as uuidValidate } from 'uuid';
import clsx from 'clsx';
import useUserAgent from '@/hooks/useUserAgent';

const workoutSchema = z.object({
  title: z.string().trim().min(1, { message: 'Routine title is required.' }),
});

const EditRoutine = () => {
  const workoutStore = useWorkoutStore();
  const userStore = useUserStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const workoutActions = useWorkoutActions(workoutStore, userStore);
  const { userAgent } = useUserAgent();

  const { isLoading, isError, data: fetchedRoutine, error } = useQuery({
    queryKey: ['routines', id, userStore.user?.unitPreference],
    queryFn: async () => {
      if (!id) throw new Error('No routine ID provided.');
      if (!userStore.user) throw new Error('User not authenticated to fetch routine.');
      if (!uuidValidate(id)) throw new Error('Invalid routine ID provided.');
      return await fetchRoutineById(id, userStore.user?.unitPreference);
    },
    staleTime: 1000 * 60 * 30,
    enabled: !!id && !!userStore.user,
  });

  useEffect(() => {
    if (workoutStore.isHydrated && fetchedRoutine) {
      if (!workoutStore.routine || workoutStore.routine.id !== fetchedRoutine.id) {
        workoutStore.setRoutine(fetchedRoutine);
      }
      if (workoutStore.storeMode !== StoreMode.ROUTINE) {
        workoutStore.setStoreMode(StoreMode.ROUTINE);
      }
    }
  }, [fetchedRoutine, workoutStore]);

  const handleSaveRoutine = async () => {
    if (!workoutStore.routine || !fetchedRoutine || !userStore.user) return;

    const routineData = { title: workoutStore.routine.title };
    const validation = workoutSchema.safeParse(routineData);

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    try {
      await editRoutine(workoutStore.routine, fetchedRoutine, userStore.user);
      await queryClient.invalidateQueries({ queryKey: ['routines'] });

      toast.success('Routine saved successfully!');
      workoutStore.emptyRoutine();
      navigate('/training');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const handleGoBack = async () => {
    navigate('/training');
  }

  const setsDetail = getTotalSets(workoutStore.routine);
  const totalVolume = getTotalVolume(workoutStore.routine, true);

  try {
    validateWorkoutInputs(id, userStore.user, 'routine');
  } catch (error: unknown) {
    return <ErrorPage errorMessage={(error as Error).message} />;
  }

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between pt-4 relative">
          <div className="absolute left-0 w-10">
            <button onClick={handleGoBack}>
              <ChevronLeft />
            </button>
          </div>
          <h1 className="text-xl font-bold tracking-tighter w-full text-center">Edit Routine</h1>
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
          <ScrollArea type="always"  className={clsx("flex-grow max-h-full", { "h-1": userAgent !== 'Safari' })}>
            <div className="flex flex-col gap-4 flex-grow pt-4">
              {workoutStore.routine.workout_exercises.map((exercise, index) => (
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

export default EditRoutine;
