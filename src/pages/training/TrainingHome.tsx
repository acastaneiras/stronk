"use client"
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResponsiveModal } from '@/shared/ResponsiveModal'
import { supabase } from '@/utils/supabaseClient'
import { MoreHorizontal, PlusCircle, SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Welcome = () => {
	const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
	const [showDropdown, setShowDropdown] = useState<null | number>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) console.log('error', error);
			else console.log('data', data);
		}
		fetchUser()
	}, [])

	return (
		<>
			<div className={`transition-all duration-300 ease-in-out`}>
				<h1 className="text-5xl font-bold tracking-tighter ">Training</h1>
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
							<CardFooter><Button className='w-full'>Start Routine</Button>  </CardFooter>
						</Card>

					</div>
				</div>
			</div>
			<Button onClick={() => setIsWelcomeModalOpen(true)}>Open Modal</Button>

			<ResponsiveModal
				open={isWelcomeModalOpen}
				onOpenChange={setIsWelcomeModalOpen}
				dismissable={false}
				title={`Welcome to Stronk!`}
				description={`Please fill out the following details to get started.`}
				footer={
					<Button className="w-full" onClick={() => setIsWelcomeModalOpen(false)}>
						<SaveIcon />
						Save
					</Button>
				}
			>
				<div className='text-sm text-muted-foreground'>
					<div className="grid w-full text-left gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="firstName">
								First Name <span className="text-red-600">*</span>
							</Label>
							<Input id="firstName" type="text" placeholder="Enter your first name" />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="lastName">
								Last Name <span className="text-red-600">*</span>
							</Label>
							<Input id="lastName" type="text" placeholder="Enter your last name" />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="alias">
								Alias <span className="text-xs text-gray-500">(optional)</span>
							</Label>
							<Input id="alias" type="text" placeholder="Enter your alias" />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="unitSystem">
								Unit System <span className="text-red-600">*</span>
							</Label>
							<Tabs defaultValue="kilograms" className="w-[400px]">
								<TabsList>
									<TabsTrigger value="kilograms">Kilograms</TabsTrigger>
									<TabsTrigger value="pounds">Pounds</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="intensitySetting">Intensity Setting</Label>
							<Tabs defaultValue="none" className="w-[400px]">
								<TabsList>
									<TabsTrigger value="rpe">RPE</TabsTrigger>
									<TabsTrigger value="rir">RIR</TabsTrigger>
									<TabsTrigger value="none">None</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="theme">Theme</Label>
							<Tabs defaultValue="light" className="w-[400px]">
								<TabsList>
									<TabsTrigger value="light">Light</TabsTrigger>
									<TabsTrigger value="dark">Dark</TabsTrigger>
									<TabsTrigger value="system">System</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
					</div>
				</div>
			</ResponsiveModal>
		</>
	)
}

export default Welcome
