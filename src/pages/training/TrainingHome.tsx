import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import WelcomeModal from '@/shared/training/WelcomeModal';
import { useUserStore } from '@/stores/userStore';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
	const { isUserSetupComplete } = useUserStore();
	const [showDropdown, setShowDropdown] = useState<null | number>(null);


	return (
		<>
			<div className={`transition-all duration-300 ease-in-out`}>
				<h1 className="text-5xl font-bold tracking-tighter">Training</h1>
				<div className='flex flex-col py-6 gap-y-4'>
					<Link to="/training/create-new-workout">
						<Button className='w-full'>Create New Workout</Button>
					</Link>

					<div className='flex flex-col gap-y-4'>
						<div className='flex flex-row gap-4 items-center'>
							<h1 className='text-4xl'>My routines</h1>
							<Link to="/training/create-routine">
								<PlusCircle className='w-8 h-8' />
							</Link>
						</div>

						<Card className='shadow-none relative'>
							<CardHeader>
								<div className='flex justify-between items-center'>
									<div>
										<CardTitle className='text-2xl'>Routine 1 Name</CardTitle>
										<CardDescription>X exercises</CardDescription>
									</div>
									<MoreHorizontal className="cursor-pointer" onClick={() => setShowDropdown(showDropdown === 1 ? null : 1)} />
								</div>
							</CardHeader>
							{showDropdown === 1 && (
								<div className='absolute right-0 top-16 bg-white shadow-md p-2 rounded-md'>
									<Link to="/training/edit-routine/1">
										<Button className='w-full' variant='outline'>Edit Routine</Button>
									</Link>
								</div>
							)}
							<CardFooter>
								<Button className='w-full'>Start Routine</Button>
							</CardFooter>
						</Card>

						<Card className='shadow-none relative'>
							<CardHeader>
								<div className='flex justify-between items-center'>
									<div>
										<CardTitle className='text-2xl'>Routine 2 Name</CardTitle>
										<CardDescription>X exercises</CardDescription>
									</div>
									<MoreHorizontal className="cursor-pointer" onClick={() => setShowDropdown(showDropdown === 2 ? null : 2)} />
								</div>
							</CardHeader>
							{showDropdown === 2 && (
								<div className='absolute right-0 top-16 bg-white shadow-md p-2 rounded-md'>
									<Link to="/training/edit-routine/2">
										<Button className='w-full' variant='default'>Edit Routine</Button>
									</Link>
									<Link to="/training/delete-routine/2">
										<Button className='w-full' variant='destructive'>Remove Routine</Button>
									</Link>
								</div>
							)}
							<CardFooter><Button className='w-full'>Start Routine</Button></CardFooter>
						</Card>

					</div>
				</div>
			</div>
						
			<WelcomeModal
        isOpen={isUserSetupComplete === false}
      />

		</>
	);
};

export default Welcome;
