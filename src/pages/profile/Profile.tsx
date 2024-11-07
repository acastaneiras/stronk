import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageIcon, Settings, Trophy } from 'lucide-react'

const Profile = () => {
	return (
		<div>
			<div className='flex flex-row justify-between items-center mb-6'>
				<div>
					<h1 className="text-5xl font-bold tracking-tighter ">Profile</h1>
				</div>
				<Drawer>
					<DrawerTrigger asChild>
						<Settings />
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle><h1 className='text-3xl text-bold text-center'>Settings</h1></DrawerTitle>
							<DrawerDescription>
								<div className="grid w-full max-w-xs my-8 text-left gap-4">
									<div className='flex flex-col gap-2'>
										<Label htmlFor="firstName">First Name <span className="text-red-600">*</span></Label>
										<Input id="firstName" type="text" placeholder="Enter your first name" />
									</div>
									<div className='flex flex-col gap-2'>
										<Label htmlFor="lastName">Last Name <span className="text-red-600">*</span></Label>
										<Input id="lastName" type="text" className='w-full' placeholder="Enter your last name" />
									</div>
									<div className='flex flex-col gap-2'>
										<Label htmlFor="alias">Alias <span className="text-xs text-gray-500">(optional)</span></Label>
										<Input id="alias" type="text" placeholder="Enter your alias" />
									</div>
									<div className='flex flex-col gap-2'>
										<Label htmlFor="alias">Unit System <span className="text-red-600">*</span></Label>
										<Tabs defaultValue="account" className="w-[400px]">
											<TabsList>
												<TabsTrigger value="account">Kilograms</TabsTrigger>
												<TabsTrigger value="password">Pounds</TabsTrigger>
											</TabsList>
										</Tabs>
									</div>
									<div className='flex flex-col gap-2'>
										<Label htmlFor="alias">Intensity Setting</Label>
										<Tabs defaultValue="none" className="w-[400px]">
											<TabsList>
												<TabsTrigger value="account">RPE</TabsTrigger>
												<TabsTrigger value="password">RIR</TabsTrigger>
												<TabsTrigger value="none">None</TabsTrigger>
											</TabsList>
										</Tabs>
									</div>
									<div className='flex flex-col gap-2'>
										<Label htmlFor="alias">Theme</Label>
										<Tabs defaultValue="account" className="w-[400px]">
											<TabsList>
												<TabsTrigger value="account">Light</TabsTrigger>
												<TabsTrigger value="password">Dark</TabsTrigger>
												<TabsTrigger value="system">System</TabsTrigger>
											</TabsList>
										</Tabs>
									</div>
								</div>
							</DrawerDescription>
						</DrawerHeader>
						<DrawerFooter>
							<Button className='w-full'>Save</Button>
							<Button variant="destructive" className='w-full mt-4 flex flex-row items-center gap-2'>
								Log out
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</div>
			<div className='flex flex-col gap-5'>
				<div className='flex flex-row text-center justify-between'>
					<div>
						<div className='font-bold'>
							X
						</div>
						<div>Workouts</div>
					</div>
					<div>
						<div className='font-bold'>
							hh:mm
						</div>
						<div>Avg. time</div>
					</div>
					<div>
						<div className='font-bold'>
							X
						</div>
						<div>Week volume</div>
					</div>
				</div>
				<Card className='shadow-none'>
					<CardHeader className='flex flex-row items-center justify-between'>
						<div>

							<CardTitle className='text-2xl flex flex-row items-center gap-2'>Last PR <Trophy /></CardTitle>
							<CardDescription>dd/mm</CardDescription>
						</div>
						<div>
							<h1 className='text-2xl font-bold'>WeightxReps</h1>

							<div className='text-right'>
								Exercise
							</div>
						</div>
					</CardHeader>
				</Card>
				<div className='flex flex-row justify-between items-center'>
					<h1 className="text-3xl font-bold tracking-tighter">My workouts</h1>
				</div>
				<Card className='shadow-none'>
					<CardHeader>
						<CardTitle>
							<h1 className='text-2xl flex flex-row items-center gap-2'>
								Workout Title
							</h1>
							<h3 className='text-sm font-extralight text-gray-500'>John Doe, (Jdoe)</h3>
						</CardTitle>
						<CardDescription>Weekname, Month Day, Year</CardDescription>
						<div className='flex flex-row text-center gap-10'>
							<div>
								<div className='font-bold'>
									X
								</div>
								<div>Time</div>
							</div>
							<div>
								<div className='font-bold'>
									X
								</div>
								<div>Volume</div>
							</div>
						</div>
					</CardHeader>
					<Separator />
					<CardContent className='pt-6'>
						<div className='flex flex-col justify-between gap-8'>
							<div className='flex flex-col '>
								<div className='flex flex-row w-full items-center'>
									<ImageIcon />
									<h1 className='text-xl font-bold flex-row gap-2'>
										Exercise 1
									</h1>

								</div>
								<div className='text-gray-500'>x2 sets</div>
							</div>
							<div className='flex flex-col '>

								<div className='flex flex-row w- items-center'>
									<ImageIcon />
									<h1 className='text-xl font-bold flex-row gap-2'>
										Exercise 2
									</h1>

								</div>
								<div className='text-gray-500'>x2 sets</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}

export default Profile