import { Button } from '@/components/ui/button';
import { WeightUnit } from '@/models/ExerciseSet';
import { Routine } from '@/models/Workout';
import WelcomeModal from '@/shared/modals/WelcomeModal';
import CreateNewWorkoutSection from '@/shared/training/CreateNewWorkoutSection';
import RoutineCard from '@/shared/training/routines/RoutineCard';
import { useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore } from '@/stores/workoutStore';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../LoadingPage';
import { fetchRoutinesWithExercises } from '@/utils/userDataLoader';

const TrainingHome = () => {
	const navigate = useNavigate();
	const { isUserSetupComplete, user } = useUserStore();
	const { setStoreMode, newRoutine } = useWorkoutStore();

	const { data: routines, isLoading, isError, error } = useQuery<Routine[], Error>({
		queryKey: ["routines", user?.id, user?.unitPreference, user?.intensitySetting],
		queryFn: () => fetchRoutinesWithExercises(user?.id as string, user?.unitPreference as WeightUnit),
		enabled: (!!user),
		staleTime: 1000 * 60 * 5,
	});

	const handleNewRoutineClick = () => {
		setStoreMode(StoreMode.ROUTINE);
		newRoutine(user!.id);
		navigate('/training/create-routine');
	}

	if (isLoading) return <LoadingPage />;
	if (isError) return <p>Error: {error?.message}</p>; //TODO: Create a custom error page

	return (
		<>
			<div className={`transition-all duration-300 ease-in-out`}>
				<h1 className="text-5xl font-bold tracking-tighter">Training</h1>
				<div className='flex flex-col py-6 gap-y-4'>
					<CreateNewWorkoutSection />
					<div className='flex flex-col gap-y-4'>
						<div className='flex flex-row gap-4 items-center'>
							
							<h1 className="text-3xl font-bold tracking-tighter">My routines</h1>
						</div>
						<Button variant={`default`} onClick={handleNewRoutineClick}>
							<Plus /> Add New Routine
						</Button>

						{routines?.map((routine) => (
							<RoutineCard key={routine.id} routine={routine} />
						))}
					</div>
				</div>
			</div>

			<WelcomeModal
				isOpen={isUserSetupComplete === false}
			/>

		</>
	);
};

export default TrainingHome;

