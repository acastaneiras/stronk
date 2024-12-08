import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import useWorkoutActions from '@/hooks/useWorkoutActions';
import ErrorPage from '@/pages/ErrorPage';
import LoadingPage from '@/pages/LoadingPage';
import NotesModal from '@/shared/modals/NotesModal';
import RemoveExerciseModal from '@/shared/modals/RemoveExerciseModal';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import RestTimeModal from '@/shared/modals/RestTimeModal';
import RIRModal from '@/shared/modals/RIRModal';
import RPEModal from '@/shared/modals/RPEModal';
import SetTypeModal from '@/shared/modals/SetTypeModal';
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise';
import { useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore } from '@/stores/workoutStore';
import { editWorkout, fetchWorkoutById } from '@/utils/apiCalls';
import { formatTime, formatWeightDecimals, formatWeightUnit, getTotalSets, getTotalVolume, incompleteSets, validateWorkoutInputs } from '@/utils/workoutUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import NoExercises from '../NoExercises';
import { validate as uuidValidate } from 'uuid';

const workoutSchema = z.object({
  title: z.string().nonempty('Workout title is required.'),
  description: z.string().optional(),
});

const EditWorkout = () => {
  const workoutStore = useWorkoutStore();
  const userStore = useUserStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const workoutActions = useWorkoutActions(workoutStore, userStore);
  
  const [showIncompleteExerciseModal, setShowIncompleteExerciseModal] = useState(false);

  const { isLoading, isError, data: fetchedWorkout, error } = useQuery({
    queryKey: ['workouts', id, userStore.user?.unitPreference],
    queryFn: async () => {
      if (!id) throw new Error('No workout ID provided.');
      if (!userStore.user) throw new Error('User not authenticated to fetch workout.');
      if (!uuidValidate(id)) throw new Error('Invalid workout ID provided.');

      return await fetchWorkoutById(id, userStore.user?.unitPreference);
    },
    staleTime: 1000 * 60 * 30,
    enabled: !!id && !!userStore.user,
  });

  useEffect(() => {
    if (workoutStore.isHydrated && fetchedWorkout) {
      if (!workoutStore.editingWorkout || workoutStore.editingWorkout.id !== fetchedWorkout.id) {
        workoutStore.setEditingWorkout(fetchedWorkout);
      }
      if (workoutStore.storeMode !== StoreMode.EDIT_WORKOUT) {
        workoutStore.setStoreMode(StoreMode.EDIT_WORKOUT);
      }
    }
  }, [fetchedWorkout, workoutStore]);

  const handleSaveWorkoutPress = async () => {
    if (!workoutStore.editingWorkout || !fetchedWorkout) return;
    if (incompleteSets(workoutStore.editingWorkout) || workoutStore.editingWorkout?.workout_exercises?.length === 0) {
      setShowIncompleteExerciseModal(true);
      return;
    }
    handleSaveWorkout();
  };

  const handleSaveWorkout = async () => {
    const workoutData = {
      title: workoutStore.editingWorkout?.title,
      description: workoutStore.editingWorkout?.description,
    };

    const validation = workoutSchema.safeParse(workoutData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    try {
      await editWorkout( workoutStore.editingWorkout!, fetchedWorkout!, getTotalSets(workoutStore.editingWorkout), getTotalVolume(workoutStore.editingWorkout), userStore.user!);
      await queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast.success('Workout saved successfully!');
      workoutStore.setEditingWorkout(null);
      navigate('/profile');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const setsDetail = getTotalSets(workoutStore.editingWorkout);
  const totalVolume = getTotalVolume(workoutStore.editingWorkout);

  try {
    validateWorkoutInputs(id, userStore.user);
  } catch (error: unknown) {
    return <ErrorPage errorMessage={(error as Error).message} />;
  }

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between pt-4 relative">
          <div className="absolute w-10 left-0">
            <button
              onClick={() => {
                workoutStore.setEditingWorkout(null);
                navigate(-1);
              }}
            >
              <ChevronLeft />
            </button>
          </div>
          <h1 className="text-xl font-bold tracking-tighter w-full text-center">Edit Workout</h1>
          <div className="absolute right-0 flex gap-2">
            <Button onClick={handleSaveWorkoutPress}>
              <Save />
              <span className="hidden md:block">Save</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Workout title"
            className="w-full"
            value={workoutStore.editingWorkout?.title ?? ''}
            onChange={(e) =>
              workoutStore.setEditingWorkout({
                ...workoutStore.editingWorkout!,
                title: e.target.value,
              })
            }
          />
          <Textarea
            placeholder="Workout description"
            className="w-full max-h-96"
            value={workoutStore.editingWorkout?.description ?? ''}
            onChange={(e) =>
              workoutStore.setEditingWorkout({
                ...workoutStore.editingWorkout!,
                description: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-row text-center justify-center gap-14 md:gap-24">
          <div>
            <div className="font-bold">Sets</div>
            <div>
              {setsDetail.done}/{setsDetail.total}
            </div>
          </div>
          <div>
            <div className="font-bold">Volume</div>
            <div>
              {formatWeightDecimals(totalVolume)} {userStore.user ? formatWeightUnit(userStore.user.unitPreference) : 'Kg'}
            </div>
          </div>
          <div>
            <div className="font-bold">Time</div>
            <div>
              {workoutStore.editingWorkout?.duration && formatTime(workoutStore.editingWorkout.duration)}
            </div>
          </div>
        </div>
        <Separator className="h-[2px]" />
      </div>
      <div className="flex flex-col flex-grow">
        {(!!workoutStore.editingWorkout && workoutStore.editingWorkout?.workout_exercises?.length > 0) ? (
          <ScrollArea type="always" className="flex-grow max-h-full h-1">
            <div className="flex flex-col gap-4 flex-grow pt-4">
              {workoutStore.editingWorkout.workout_exercises.map((exercise, index) => (
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
        workout={workoutStore.editingWorkout}
        selectedSet={workoutActions.selectedSet}
      />
      <RIRModal
        showRIRModal={workoutActions.showRIRModal}
        setShowRIRModal={workoutActions.setShowRIRModal}
        onSaveIntensity={workoutActions.handleSaveIntensity}
        onUnsetIntensity={workoutActions.handleUnsetIntensity}
        workout={workoutStore.editingWorkout}
        selectedSet={workoutActions.selectedSet}
      />
      <NotesModal
        notesShown={workoutActions.showExerciseNotes}
        exerciseIndex={workoutActions.selectedExerciseIndex}
        setNotesShown={workoutActions.setShowExerciseNotes}
        changeNote={workoutActions.changeNoteEvent}
        workout={workoutStore.editingWorkout}
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

      <ResponsiveModal
        open={showIncompleteExerciseModal}
        onOpenChange={setShowIncompleteExerciseModal}
        dismissable={true}
        title="Incomplete Sets"
        titleClassName="text-lg font-semibold leading-none tracking-tight"
        footer={
          <Button variant="outline" onClick={() => setShowIncompleteExerciseModal(false)}>
            Dismiss
          </Button>
        }
      >
        <p>It appears you have some incomplete sets, please complete those sets before saving.</p>
      </ResponsiveModal>
    </div>
  );
};

export default EditWorkout;