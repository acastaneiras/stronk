import { Button } from '@/components/ui/button';
import { WeightUnit } from '@/models/ExerciseSet';
import { Routine } from '@/models/Workout';
import ErrorPage from "@/pages/ErrorPage";
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import WelcomeModal from '@/shared/modals/WelcomeModal';
import CreateNewWorkoutSection from '@/shared/training/CreateNewWorkoutSection';
import RoutineCard from '@/shared/training/routines/RoutineCard';
import { useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore } from '@/stores/workoutStore';
import { deleteRoutine, fetchRoutinesWithExercises } from '@/utils/apiCalls';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingPage from '../LoadingPage';

const TrainingHome = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { isUserSetupComplete, user } = useUserStore();
	const { setStoreMode, newRoutine, workout, startWorkoutFromRoutine, routine, setRoutine } = useWorkoutStore();
	const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);
	const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
	const [userHasPendingWorkout, setUserHasPendingWorkout] = useState(false);

	const { data: routines, isLoading, isError, error } = useQuery<Routine[], Error>({
		queryKey: ["routines", user?.id, user?.unitPreference, user?.intensitySetting],
		queryFn: () => fetchRoutinesWithExercises(user?.id as string, user?.unitPreference as WeightUnit),
		enabled: (!!user),
		staleTime: 1000 * 60 * 30,
	});

	useEffect(() => {
		//Clear the routine store when the user navigates away from the page
		if (routine) {
			setRoutine(null);
		}
	}, [routine, setRoutine]);


	const handleNewRoutineClick = () => {
		setStoreMode(StoreMode.ROUTINE);
		newRoutine(user!.id);
		navigate('/training/create-routine');
	}

	const handleConfirmDeleteRoutine = async () => {
		if (routineToDelete) {
			try {
				await deleteRoutine(routineToDelete);
				await queryClient.invalidateQueries({ queryKey: ['routines'] });
				toast.success('Routine deleted successfully');
				setRoutineToDelete(null);
			} catch (err: unknown) {
				if (err instanceof Error) {
					toast.error(err.message);
				} else {
					toast.error('An unknown error occurred.');
				}
			}
		}
	}

	const handleStartRoutinePress = (routine: Routine) => () => {
		setSelectedRoutine(routine);
		if (workout !== null) {
			setUserHasPendingWorkout(true);
			return;
		}
		handleConfirmDiscardWorkout(routine);
	}

	const handleConfirmDiscardWorkout = (routine: Routine | null = null) => {
		if (selectedRoutine === null && routine === null) return;
		const routineToStart = routine || selectedRoutine;
		if (routineToStart === null) return;

		setUserHasPendingWorkout(false);
		startWorkoutFromRoutine(routineToStart);
		setSelectedRoutine(null);
		navigate('/training/create-new-workout');
	}

	if (isLoading) return <LoadingPage />;
	if (isError) return <ErrorPage errorMessage={error.message} />;

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
							<RoutineCard key={routine.id} routine={routine} onDeleteRoutineClick={() => setRoutineToDelete(routine)} handleStartRoutinePress={handleStartRoutinePress(routine)} />
						))}
					</div>
				</div>
			</div>

			<WelcomeModal
				isOpen={isUserSetupComplete === false}
			/>
			<ResponsiveModal
				open={userHasPendingWorkout}
				onOpenChange={setUserHasPendingWorkout}
				dismissable={true}
				title="Discard Ongoing Workout"
				titleClassName="text-lg font-semibold leading-none tracking-tight"
				footer={
					<>
						<Button
							variant='destructive'
							onClick={() => handleConfirmDiscardWorkout(null)}
						>
							<Trash /> Yes
						</Button>
						<Button variant='outline' onClick={() => setUserHasPendingWorkout(false)}>
							Cancel
						</Button>
					</>
				}
			>
				<p>You already have an ongoing workout, do you want to discard it and start a new one with the selected routine?</p>
			</ResponsiveModal>

			<ResponsiveModal
				open={routineToDelete !== null}
				onOpenChange={() => setRoutineToDelete(null)}
				dismissable={true}
				title="Delete Workout"
				titleClassName="text-lg font-semibold leading-none tracking-tight"
				footer={
					<>
						<Button
							variant='destructive'
							onClick={handleConfirmDeleteRoutine}
						>
							<Trash /> Confirm
						</Button>
						<Button variant='outline' onClick={() => setRoutineToDelete(null)}>
							Cancel
						</Button>
					</>
				}
			>
				<p>Are you sure you want to delete this routine?</p>
			</ResponsiveModal>

		</>
	);
};

export default TrainingHome;

