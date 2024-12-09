import { Badge } from '@/components/ui/badge'
import { WeightUnit } from '@/models/ExerciseSet'
import { Workout } from '@/models/Workout'
import ErrorPage from '@/pages/ErrorPage'
import LoadingPage from '@/pages/LoadingPage'
import ExerciseHistoryChart from '@/shared/charts/ExerciseHistoryChart'
import { ImageCarousel } from '@/shared/training/workout-exercise/ImageCarousel'
import { useExercisesStore } from '@/stores/exerciseStore'
import { useUserStore } from '@/stores/userStore'
import { fetchWorkoutsWithExercises } from '@/utils/apiCalls'
import { getCategoryColor, getExerciseHistory } from '@/utils/workoutUtils'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ExerciseOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allExercises } = useExercisesStore();
  const { user } = useUserStore();

  const { data: workouts, isLoading, isError, error } = useQuery<Workout[], Error>({
    queryKey: ["workouts", user?.id, user?.unitPreference, user?.intensitySetting],
    queryFn: () => fetchWorkoutsWithExercises(user?.id as string, user?.unitPreference as WeightUnit),
    enabled: !!user,
    staleTime: 1000 * 60 * 30,
  });

  const exercise = allExercises?.find((exercise) => exercise.id === id);

  const categoryColor = exercise?.category ? getCategoryColor(exercise?.category) : '#808080';

  const exerciseMuscles = useMemo(
    () => {
      return {
        primary: exercise?.primaryMuscles?.map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1).toLowerCase()).join(', ') || 'None',
        secondary: exercise?.secondaryMuscles?.map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1).toLowerCase()).join(', ') || 'None',
      }
    }, [exercise]
  );

  const userExerciseData = useMemo(() => getExerciseHistory(workouts, exercise?.id, user?.unitPreference), [workouts, exercise, user]);

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage errorMessage={error.message} />;
  if (!exercise) return <ErrorPage errorMessage='Exercise not found' />;

  return (
    <div className='flex flex-col gap-4 pt-4'>
      <div className='flex flex-row items-center justify-between'>
        <div className='w-10'>
          <button
            onClick={() => {
              navigate(-1);
            }}
          >
            <ChevronLeft />
          </button>
        </div>
        <h1 className="text-xl font-bold tracking-tighter w-full text-center mr-10 ">Exercise Overview</h1>
      </div>
      <div className='flex flex-col gap-2 items-start'>
        <h1 className="text-3xl font-bold tracking-tighter ">{exercise?.name}</h1>
        <Badge
          className={`px-2 py-1 rounded text-white flex-grow-0 text-xs`}
          style={{ backgroundColor: `${categoryColor}` }}
        >
          {exercise?.category}
        </Badge>
      </div>
      <div className='flex flex-col'>
        <span className='text-sm'><strong>Primary Muscles:</strong> {exerciseMuscles.primary}</span>
        <span className='text-sm'><strong>Secondary Muscles:</strong> {exerciseMuscles.secondary}</span>
      </div>
      {exercise?.images && (
        <ImageCarousel images={exercise.images} />
      )}
      <h1 className='text-lg font-bold tracking-tighter'>Instructions</h1>
      <div className='flex flex-col gap-4'>
        {exercise?.instructions ? (
          exercise?.instructions.map((instruction, index) => (
            <div key={index} className='flex flex-row gap-2'>
              <span className='font-bold'>{index + 1}.</span>
              <span>{new TextDecoder("utf-8").decode(new TextEncoder().encode(instruction))}</span>
            </div>
          ))
        ) : 'No instructions available'}
      </div>
      {userExerciseData.history.length !== 0 && (
        <ExerciseHistoryChart history={userExerciseData.history} />
      )}
      <div className='py-4 flex-col'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-lg font-bold tracking-tighter'>Records</h1>
          <ul>
            <li><strong>Maximum weight lifted</strong>: {` `}
              {userExerciseData.maxWeightLifted.id !== -1 ? (<span>
                {userExerciseData.maxWeightLifted.weight.value} {userExerciseData.maxWeightLifted.weight.unit}
              </span>
              ) : 'No data available'}
            </li>
            <li><strong>Best set volume</strong>: {` `}
              {userExerciseData.bestSetVolume.id !== -1 ? (<span>
                {userExerciseData.bestSetVolume.weight.value} {userExerciseData.bestSetVolume.weight.unit} x {userExerciseData.bestSetVolume.reps} reps
              </span>
              ) : 'No data available'}
            </li>
          </ul>
        </div>
      </div>
      <div className='py-4 flex-col'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-lg font-bold tracking-tighter'>History</h1>
          {userExerciseData.history.length !== 0 ? (
            <div className='flex flex-col'>
              <div className='grid grid-cols-3 border-b pb-2'>
                <h1 className='font-bold text-left'>Reps</h1>
                <h1 className='font-bold text-left'>Weight</h1>
                <h1 className='font-bold text-left'>Day</h1>
              </div>
              {userExerciseData.history.map((data, index) => (
                <div key={index} className='grid grid-cols-3 py-2 border-b'>
                  <span className='text-left'>{data.set.reps}</span>
                  <span className='text-left'>{data.set.weight.value} {data.set.weight.unit}</span>
                  <span className='text-left'>{data.date.format("MMM D, YYYY")}</span>
                </div>
              ))}
            </div>
          ) : 'No history available'}
        </div>
      </div>
    </div>
  )
}

export default ExerciseOverview
