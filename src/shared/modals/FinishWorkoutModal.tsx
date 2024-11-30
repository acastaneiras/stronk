import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { SetCounts } from '@/models/Workout';
import MuscleIcon from '@/shared/icons/MuscleIcon';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import { useWorkoutStore } from '@/stores/workoutStore';
import { supabase } from '@/utils/supabaseClient';
import { formatTime, getTotalSets, getTotalVolume } from '@/utils/workoutUtils';
import { Dumbbell, Hash, Hourglass, Loader, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinishExerciseSummary from './FinishExerciseSummary';
import { useUserStore } from '@/stores/userStore';
import { z } from 'zod';
import { toast } from 'sonner';

const workoutSchema = z.object({
  title: z.string().nonempty("Workout title is required."),
  description: z.string().optional(),
});

const FinishWorkoutModal = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { setIsTimerEnabled, workout, weightUnits, emptyWorkout } = useWorkoutStore();
  const { user } = useUserStore();
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');

  const setsDetail: SetCounts = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);

  useEffect(() => {
    setWorkoutTitle(workout?.title || '');
    return () => {
      setIsTimerEnabled(true);
    };
  }, [workout, setIsTimerEnabled]);

  const finishWorkoutPress = async () => {
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
      const { data: workoutDataResponse, error: workoutError } = await supabase
        .from('Workouts')
        .insert([{
          title: workoutTitle,
          description: workoutDescription,
          date: workout?.startDate,
          duration: workout?.duration,
          sets: setsDetail.done,
          volume: totalVolume,
          units: weightUnits,
          userId: user?.id,
        }])
        .select();
  
      if (workoutError) {
        throw new Error('Error saving workout, please try again.');
      }
  
      const workoutId = workoutDataResponse[0].id;
  
      const workoutExercises = workout?.workout_exercises;
      if (workoutExercises) {
        const exerciseDetailsData = workoutExercises.map((exercise, index) => ({
          notes: exercise.notes,
          setInterval: exercise.setInterval,
          order: index,
          exerciseId: exercise.exercise.id,
          sets: exercise.sets,
        }));
  
        const { data: exerciseDetailsResponse, error: exerciseDetailsError } = await supabase
          .from('ExerciseDetails')
          .insert(exerciseDetailsData)
          .select();
  
        if (exerciseDetailsError) {
          throw new Error('Error saving exercises, please try again.');
        }
  
        const workoutExerciseDetailsData = exerciseDetailsResponse.map((exerciseDetail) => ({
          workoutId,
          exerciseDetailsId: exerciseDetail.id,
        }));
  
        const { error: workoutExerciseDetailsError } = await supabase
          .from('WorkoutExerciseDetails')
          .insert(workoutExerciseDetailsData);
  
        if (workoutExerciseDetailsError) {
          throw new Error('Error linking exercises to workout, please try again.');
        }
      }
  
      toast.success('Workout saved successfully!');
      onOpenChange(false);
      navigate('/training');
      emptyWorkout();
    } catch (err: any) {
      toast.error(err.message);
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
                  <span>{formatTime(workout?.duration ?? 0)}</span>
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
                  <span>{totalVolume} {weightUnits}</span>
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
