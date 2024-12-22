import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WeightUnit } from '@/models/ExerciseSet'
import { Workout } from '@/models/Workout'
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal'
import UserSettingsModal from '@/shared/modals/UserSettingsModal'
import PastWorkoutCard from '@/shared/profile/PastWorkoutCard'
import { useUserStore } from '@/stores/userStore'
import { deleteWorkout, fetchWorkoutsWithExercises } from '@/utils/apiCalls'
import { formatTime, getAllWorkoutsAverageTime, getUserLastExercisePR, getUserWeeklyVolume } from '@/utils/workoutUtils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Settings, Trash, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import LoadingPage from '../LoadingPage'
import { useWorkoutStore } from '@/stores/workoutStore'

const Profile = () => {
	const { user } = useUserStore();
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const { editingWorkout, setEditingWorkout } = useWorkoutStore();
	const queryClient = useQueryClient();
	
	const { data: workouts, isLoading, isError, error } = useQuery<Workout[], Error>({
		queryKey: ["workouts", user?.id, user?.unitPreference, user?.intensitySetting],
		queryFn: () => fetchWorkoutsWithExercises(user?.id as string, user?.unitPreference as WeightUnit),
		enabled: !!user,
    staleTime: 1000 * 60 * 30,
	});
	
	useEffect(() => {
		//Clear the workout store when the user navigates away from the page
		if (editingWorkout) {
			setEditingWorkout(null);
		}
	}, [editingWorkout, setEditingWorkout]);

	const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

	const averageTime = useMemo(() => {
		if (!workouts) return [];
		return formatTime(getAllWorkoutsAverageTime(workouts))
	}, [workouts]);

	const weekVolume = useMemo(() => {
		if (!workouts || !user) return 0;
		return getUserWeeklyVolume(workouts, user.unitPreference)
	}, [workouts, user]);

	const userLastPR = useMemo(() => {
		if (!workouts || !user) return null;
		return getUserLastExercisePR(workouts, user.unitPreference)
	}, [workouts, user]);

	if (isLoading) return <LoadingPage />;
	if (isError) return <p>Error: {error?.message}</p>;

	const handleDeleteWorkoutPress = (workout: Workout) => () => {
		setWorkoutToDelete(workout);
	}

	const handleConfirmDeleteWorkout = async () => {
		if (workoutToDelete) {
			try {
				await deleteWorkout(workoutToDelete);
				await queryClient.invalidateQueries({ queryKey: ['workouts'] });
				toast.success('Workout deleted successfully');
				setWorkoutToDelete(null);
			} catch (err: unknown) {
				if (err instanceof Error) {
					toast.error(err.message);
				} else {
					toast.error('An unknown error occurred.');
				}
			}
		}
	};

	return (
		<div>
			<div className='flex flex-row justify-between items-center mb-6'>
				<div>
					<h1 className="text-5xl font-bold tracking-tighter ">Profile</h1>
				</div>
				<button onClick={() => setShowSettingsModal(true)}>
					<Settings />
				</button>
			</div>
			<div className='flex flex-col gap-5'>
				<div className='flex flex-row text-center justify-between'>
					<div>
						<div className='font-bold'>
							{workouts?.length}
						</div>
						<div>Workouts</div>
					</div>
					<div>
						<div className='font-bold'>
							{averageTime}
						</div>
						<div>Avg. time</div>
					</div>
					<div>
						<div className='font-bold'>
							{weekVolume} {user?.unitPreference}
						</div>
						<div>Week volume</div>
					</div>
				</div>
				{
					userLastPR && (
						<Card className='shadow-none bg-accent'>
							<CardHeader className='flex flex-row items-center justify-between'>
								<div>
									<CardTitle className='text-2xl flex flex-row items-center gap-2'>Last PR <Trophy className='text-yellow-600' /></CardTitle>
									<CardDescription>{dayjs(userLastPR.date).format("DD/MM/YYYY")}</CardDescription>
								</div>
								<div>
									<h1 className='text-2xl font-bold text-right'>{userLastPR.set.weight.value} {userLastPR.set.weight.unit} x {userLastPR.set.reps}</h1>
									<div className='text-right'>
										{userLastPR.exercise.name} ({userLastPR.exercise.category})
									</div>
								</div>
							</CardHeader>
						</Card>
					)
				}

				<div className='flex flex-row justify-between items-center'>
					<h1 className="text-3xl font-bold tracking-tighter">My workouts</h1>
				</div>
				<div className='flex flex-col gap-4'>
					{workouts && workouts.length > 0 ? (
						workouts?.map((pastWorkout) => (
							<PastWorkoutCard key={pastWorkout.id} pastWorkout={pastWorkout} handleDeleteWorkoutPress={handleDeleteWorkoutPress(pastWorkout)} />
						))) : (
						<div className="flex items-center  h-full">
							<h2 className="text-lg">No workouts yet.</h2>
						</div>
					)
					}
				</div>
			</div>
			<UserSettingsModal isOpen={showSettingsModal} setShowUserSettingsModal={setShowSettingsModal} />
			<ResponsiveModal
				open={workoutToDelete !== null}
				onOpenChange={() => setWorkoutToDelete(null)}
				dismissable={true}
				title="Delete Workout"
				titleClassName="text-lg font-semibold leading-none tracking-tight"
				footer={
					<>
						<Button
							variant='destructive'
							onClick={handleConfirmDeleteWorkout}
						>
							<Trash /> Confirm
						</Button>
						<Button variant='outline' onClick={() => setWorkoutToDelete(null)}>
							Cancel
						</Button>
					</>
				}
			>
				<p>Are you sure you want to delete this workout?</p>
			</ResponsiveModal>
		</div>
	)
}

export default Profile