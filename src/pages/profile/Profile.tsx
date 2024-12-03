import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { WeightUnit } from '@/models/ExerciseSet'
import { Workout } from '@/models/Workout'
import UserSettingsModal from '@/shared/modals/UserSettingsModal'
import { useUserStore } from '@/stores/userStore'
import { fetchWorkoutsWithExercises } from '@/utils/userDataLoader'
import { formatTime, formatWeightDecimals, getAllWorkoutsAverageTime, getCategoryColor, getUserLastExercisePR, getUserWeeklyVolume } from '@/utils/workoutUtils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Edit, EllipsisVertical, Eye, ImageIcon, Settings, Trash, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import LoadingPage from '../LoadingPage'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useNavigate } from 'react-router-dom'
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal'
import { supabase } from '@/utils/supabaseClient'
import { toast } from 'sonner'

const Profile = () => {
	const { user } = useUserStore();
	const { setOnGoingWorkout, setWorkout, workout, setIsEditing, setFetchedWorkout } = useWorkoutStore();
	const navigate = useNavigate();
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const queryClient = useQueryClient();
	const { data: workouts, isLoading, isError, error } = useQuery<Workout[], Error>({
		queryKey: ["workouts", user?.id, user?.unitPreference, user?.intensitySetting],
		queryFn: () => fetchWorkoutsWithExercises(user?.id as string, user?.unitPreference as WeightUnit),
		enabled: !!user,
		staleTime: 1000 * 60 * 5,
	});

	const [deleteWorkout, setDeleteWorkout] = useState<Workout | null>(null);

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

	const handleEditWorkoutClick = (workoutToEdit: Workout) => {
		if (workout) { // If there is a workout, set the ongoing workout to the current workout
			setOnGoingWorkout(workout);
		}
		setWorkout(workoutToEdit);
		setFetchedWorkout(workoutToEdit);
		setIsEditing(true);
		navigate('/training/edit-workout');
	}

	const handleDeleteWorkoutPress = (workout: Workout) => () => {
		setDeleteWorkout(workout);
	}

	const handleConfirmDeleteWorkout = async () => {
		if (deleteWorkout) {
			try {
				const exerciseDetailsIds = deleteWorkout.workout_exercises.map(exercise => exercise.id);
				const { error: exerciseDetailsError } = await supabase
					.from('ExerciseDetails')
					.delete()
					.in('id', exerciseDetailsIds);

				if (exerciseDetailsError) {
					throw new Error('Error deleting exercise details');
				}
				const { error: workoutError } = await supabase
					.from('Workouts')
					.delete()
					.eq('id', deleteWorkout.id);

				if (workoutError) {
					throw new Error('Error deleting workout');
				}

				await queryClient.invalidateQueries(
					{
						queryKey: ["workouts", user?.id],
						refetchType: 'active',
					},
					{
						cancelRefetch: true,
						throwOnError: true,
					}
				);
				toast.success('Workout deleted successfully');
				setDeleteWorkout(null);

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
						<Card className='shadow-none'>
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
						workouts?.map((workout) => (
							<Card key={workout.id} className="shadow-none">
								<CardHeader>
									<CardTitle className='flex flex-row justify-between'>
										<div className='flex flex-col'>
											<h1 className="text-2xl flex flex-row items-center gap-2">
												{workout.title}
											</h1>
											<h3 className="text-sm font-extralight text-gray-500">
												{user?.firstName} {user?.lastName} {`(${user?.alias})`}
											</h3>
										</div>
										<div className='pl-4 py-3'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost">
														<EllipsisVertical className="h-5" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-56 flex flex-col gap-1">
													<DropdownMenuItem asChild>
														<Button variant="ghost" className="w-full justify-start border-none cursor-pointer" onClick={() => handleEditWorkoutClick(workout)}>
															<Edit className="h-4 w-4 mr-2" /> Edit workout
														</Button>
													</DropdownMenuItem>
													<DropdownMenuItem asChild>
														<Button variant="destructive" onClick={handleDeleteWorkoutPress(workout)} className="w-full justify-start border-none cursor-pointer">
															<Trash className="h-4 w-4 mr-2" /> Delete workout
														</Button>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</CardTitle>
									<CardDescription>
										{workout.date.format("dddd, MMMM D, YYYY")} at {workout.date.format("h:mm A")}
									</CardDescription>
									<div className="flex flex-row text-center gap-10">
										<div>
											<div className="font-bold">{workout?.duration ? formatTime(workout?.duration) : "N/A"}</div>
											<div>Time</div>
										</div>
										<div>
											<div className="font-bold">{formatWeightDecimals(workout.volume)} {user?.unitPreference}</div>
											<div>Volume</div>
										</div>
									</div>
								</CardHeader>
								<Separator />
								<CardContent className="pt-6">
									<div className="flex flex-col gap-4">
										{workout.workout_exercises.slice(0, 2).map((exercise, index) => (
											<div key={`${exercise.id.toString()}-${index}`} className="flex flex-row items-center justify-between">
												<div className="flex flex-row items-center gap-4">
													<ImageIcon />
													<div>
														<h1 className="text-xl font-bold">{exercise.exercise.name}</h1>
														<p className="text-gray-500">{exercise.sets.length} {exercise.sets.length > 1 ? 'sets' : 'set'}</p>
													</div>
												</div>
												<div>
													<Badge style={{ backgroundColor: getCategoryColor(exercise.exercise.category!) }}>{exercise.exercise.category}</Badge>
												</div>
											</div>
										))}
										{workout.workout_exercises.length > 2 && (
											<div className="text-gray-500 text-sm">
												({workout.workout_exercises.length - 2} more {workout.workout_exercises.length - 2 > 1 ? "exercises" : "exercise"})
											</div>
										)}
									</div>
								</CardContent>
								<CardFooter>
									<Button><Eye /> View Details</Button>
								</CardFooter>
							</Card>
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
				open={deleteWorkout !== null}
				onOpenChange={() => setDeleteWorkout(null)}
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
						<Button variant='outline' onClick={() => setDeleteWorkout(null)}>
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