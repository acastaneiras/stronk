import { Button } from '@/components/ui/button';
import WelcomeModal from '@/shared/modals/WelcomeModal';
import CreateNewWorkoutSection from '@/shared/training/CreateNewWorkoutSection';
import RoutineCard from '@/shared/training/routines/RoutineCard';
import { useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore } from '@/stores/workoutStore';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainingHome = () => {
	const navigate = useNavigate();
	const { isUserSetupComplete, user } = useUserStore();
	const { setStoreMode, newRoutine } = useWorkoutStore();
	const routines = [];

	const handleNewRoutineClick = () => {
		setStoreMode(StoreMode.ROUTINE);
		newRoutine(user!.id);
		navigate('/training/create-routine');
	}
	return (
		<>
			<div className={`transition-all duration-300 ease-in-out`}>
				<h1 className="text-5xl font-bold tracking-tighter">Training</h1>
				<div className='flex flex-col py-6 gap-y-4'>
					<CreateNewWorkoutSection />
					<div className='flex flex-col gap-y-4'>
						<div className='flex flex-row gap-4 items-center'>
							<h1 className='text-4xl'>My routines</h1>
						</div>
						<Button variant={`default`} onClick={handleNewRoutineClick}>
							<Plus /> Add New Routine
						</Button>

						{routines.length > 0 &&
							(<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
								{routines.map((routine) => (
									<RoutineCard key={routine.id} />
								))}
							</div>)}
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
