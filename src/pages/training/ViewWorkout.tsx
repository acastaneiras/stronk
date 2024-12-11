import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ErrorPage from '@/pages/ErrorPage';
import LoadingPage from '@/pages/LoadingPage';
import WorkoutExerciseView from '@/shared/training/workout-exercise/WorkoutExerciseView';
import { useUserStore } from '@/stores/userStore';
import { fetchWorkoutById } from '@/utils/apiCalls';
import { formatTime, formatWeightDecimals, formatWeightUnit, getTotalSets, getTotalVolume, validateWorkoutInputs } from '@/utils/workoutUtils';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { validate as uuidValidate } from 'uuid';
import NoExercises from './NoExercises';

const ViewWorkout = () => {
  const { id } = useParams();
  const { user } = useUserStore();

  const { isLoading, isError, data: fetchedWorkout, error } = useQuery({
    queryKey: ['workouts', id, user?.unitPreference],
    queryFn: async () => {
      if (!id) throw new Error('No workout ID provided.');
      if (!user) throw new Error('User not authenticated to fetch workout.');
      if (!uuidValidate(id)) throw new Error('Invalid workout ID provided.');

      return await fetchWorkoutById(id, user?.unitPreference);
    },
    staleTime: 1000 * 60 * 30,
    enabled: !!id && !!user,
  });

  try {
    validateWorkoutInputs(id, user);
  } catch (error: unknown) {
    return <ErrorPage errorMessage={(error as Error).message} />;
  }

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  const setsDetail = fetchedWorkout ? getTotalSets(fetchedWorkout) : { done: 0, total: 0 };
  const totalVolume = fetchedWorkout ? getTotalVolume(fetchedWorkout) : 0;

  return (
    <div className='flex flex-col flex-1'>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between pt-4 relative">
          <div className="absolute w-10 left-0">
            <Link to="/profile">

              <ChevronLeft />
            </Link>
          </div>
          <h1 className="text-xl font-bold tracking-tighter w-full text-center">View Workout</h1>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 py-5'>
        <h1 className='text-2xl text-center line-clamp-2'>
          {fetchedWorkout?.title}
        </h1>
        <h3 className="text-sm font-extralight text-gray-800 dark:text-gray-100 line-clamp-2">
          {user?.firstName} {user?.lastName} {`(${user?.alias})`} - {fetchedWorkout?.date.format("dddd, MMMM D, YYYY")} at {fetchedWorkout?.date.format("h:mm A")}
        </h3>

      </div>

      <div className="flex flex-row text-center justify-center gap-14 md:gap-24 mb-2">
        <div>
          <div className="font-bold">Sets</div>
          <div>
            {setsDetail.done}/{setsDetail.total}
          </div>
        </div>
        <div>
          <div className="font-bold">Volume</div>
          <div>
            {formatWeightDecimals(totalVolume)} {user ? formatWeightUnit(user.unitPreference) : 'Kg'}
          </div>
        </div>
        <div>
          <div className="font-bold">Time</div>
          <div>
            {fetchedWorkout?.duration && formatTime(fetchedWorkout.duration)}
          </div>
        </div>
      </div>
      <Separator className='h-[2px]' />

      <div className="flex flex-col flex-grow">
        {(!!fetchedWorkout && fetchedWorkout?.workout_exercises?.length > 0) ? (
          <ScrollArea type="always" className="flex-grow max-h-full md:h-1">
            <div className="flex flex-col gap-4 flex-grow py-4">
              {fetchedWorkout.workout_exercises.map((exercise, index) => (
                <WorkoutExerciseView
                  id={index}
                  key={`${exercise.id}-${index}`}
                  currentExercise={exercise}
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
    </div>
  )
}

export default ViewWorkout
