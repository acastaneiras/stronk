import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Routine, SetCounts } from '@/models/Workout';
import MuscleIcon from '@/shared/icons/MuscleIcon';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import { useUserStore } from '@/stores/userStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { createWorkout } from '@/utils/apiCalls';
import { calculateElapsedSecondsFromDate, checkRoutineChanges, formatTime, getTotalSets, getTotalVolume } from '@/utils/workoutUtils';
import { useQueryClient } from '@tanstack/react-query';
import { Dumbbell, Hash, Hourglass, Loader, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import FinishExerciseSummary from './FinishExerciseSummary';

const workoutSchema = z.object({
  title: z.string().nonempty("Workout title is required."),
  description: z.string().optional(),
});

const FinishWorkoutModal = ({ open, onOpenChange, onChangedRoutine }: { open: boolean, onOpenChange: (open: boolean) => void, onChangedRoutine: ({ routine, oldExerciseIds }: { routine: Routine, oldExerciseIds: string[] }) => void }) => {
  const { workout, emptyWorkout } = useWorkoutStore();
  const { user } = useUserStore();
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');

  const setsDetail: SetCounts = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);
  const [workoutDuration, setWorkoutDuration] = useState(0);



  useEffect(() => {
    if (workout) {
      setWorkoutTitle(workout?.title || '');
      setWorkoutDuration(calculateElapsedSecondsFromDate(workout.date));
    }
  }, [open, workout]);

  const finishWorkoutPress = async () => {
    if (!workout || !user) return;
    const workoutData = {
      title: workoutTitle,
      description: workoutDescription,
    };

    const validation = workoutSchema.safeParse(workoutData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setSpinner(true);

    try {
      await createWorkout(workout, workoutTitle, workoutDescription, workoutDuration, setsDetail, totalVolume, user);
      await queryClient.invalidateQueries({ queryKey: ['workouts'] });

      if (workout.routine) {
        //Check if the workout has changed and update the routine if the user wants to
        const changedRoutine = checkRoutineChanges(workout, user);
        onOpenChange(false);

        if (changedRoutine !== false) {
          const { updatedRoutine, oldRoutineExercisesIds } = changedRoutine;
          onChangedRoutine({ routine: updatedRoutine, oldExerciseIds: oldRoutineExercisesIds });
          return;
        }
      }
      toast.success('Workout saved successfully!');
      emptyWorkout();
      navigate('/training');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      setSpinner(false);
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Finish Workout" titleClassName="text-lg font-semibold leading-none tracking-tight" footer={
      <Button
        onClick={finishWorkoutPress}
        className="w-full flex justify-center items-center py-3 rounded-lg"
        disabled={spinner}
      >
        {spinner && <Loader className="animate-spin h-16 w-16 text-gray-700 text-center dark:text-gray-300" />}
        <Save />
        <span className="ml-2">Finish Workout</span>
      </Button>
    }>
      <div className="flex flex-col flex-grow overflow-hidden">
        <ScrollArea type="always" className="flex-grow max-h-full h-96">
          <div className="py-4 pr-4">
            <Input
              placeholder="Workout title (required)"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              className="mb-4"
            />
            <Textarea
              placeholder="Description"
              value={workoutDescription}
              onChange={(e) => setWorkoutDescription(e.target.value)}
              className="mb-4 h-52"
            />
            <div className="mb-4">
              <p className="font-bold text-lg">Summary</p>
              <div className="flex justify-start gap-2 flex-wrap py-4">
                <Badge variant={`outline`} className='gap-1 flex items-center justify-start'>
                  <Hourglass className='h-4 w-4' />
                  <span>{formatTime(workoutDuration ?? 0)}</span>
                </Badge>

                <Badge variant={`outline`} className='gap-1 flex items-center justify-start'>
                  <MuscleIcon className="stroke-black dark:stroke-white" width={15} />
                  <span>{workout?.workout_exercises?.length ?? 0}</span>
                  exercises
                </Badge>
                <Badge variant={`outline`} className='gap-1 flex items-center justify-start'>
                  <Hash className='h-4 w-4' />
                  <span>{setsDetail.done}</span>
                  sets
                </Badge>

                <Badge variant={`outline`} className='gap-1 flex items-center justify-start'>
                  <Dumbbell className='h-4 w-4' />
                  <span>{totalVolume} {user?.unitPreference}</span>
                  total
                </Badge>
              </div>
            </div>
            {workout?.workout_exercises?.map((exercise, index) => (
              <div key={index} className="mb-4">
                <FinishExerciseSummary currentExercise={exercise} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </ResponsiveModal>
  );
};

export default FinishWorkoutModal;
