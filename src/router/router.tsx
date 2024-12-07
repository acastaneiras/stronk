
import Providers from "@/Providers";
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ExerciseListLayout from "@/layouts/ExerciseListLayout";
import HomeLayout from '@/layouts/HomeLayout';
import WorkoutLayout from '@/layouts/WorkoutLayout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import EmailConfirmation from "@/pages/auth/EmailConfirmation";
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import Profile from '@/pages/profile/Profile';
import ExerciseList from '@/pages/training/ExerciseList';
import ExerciseOverview from '@/pages/training/ExerciseOverview';
import ReorderExercises from '@/pages/training/ReorderExercises';
import TrainingHome from '@/pages/training/TrainingHome';
import ViewWorkout from '@/pages/training/ViewWorkout';
import CreateNewWorkout from '@/pages/training/workout/CreateNewWorkout';
import CreateRoutine from '@/pages/training/workout/CreateRoutine';
import EditRoutine from '@/pages/training/workout/EditRoutine';
import EditWorkout from '@/pages/training/workout/EditWorkout';
import { createBrowserRouter } from "react-router-dom";
import AuthProtectedRoute from "./AuthProtectedRoute";
import OAuthCallback from "./OAuthCallback";


const router = createBrowserRouter([
	{
		element: <Providers />, //Wrap the entire app in the Providers component
		children: [
			{
				element: <HomeLayout />,
				errorElement: <NotFound />,
				children: [
					{
						path: '/',
						element: <Home />,
					},
				],
			},
			{
				path: '/oauth-callback',
				element: <OAuthCallback />,
			},
			{
				element: <AuthLayout />,
				children: [
					{
						path: '/sign-in',
						element: <SignIn />,
					},
					{
						path: '/sign-up',
						element: <SignUp />,
					},
					{
						path: '/forgot-password',
						element: <ForgotPassword />,
					},
					{
						path: '/reset-password',
						element: <ResetPassword />,
					},
					{
						path: '/confirm-email',
						element: <EmailConfirmation />,
					}
				],
			},
			{
				//Protected routes
				path: '/profile',
				element: <AuthProtectedRoute />,
				children: [
					{
						element: <AppLayout />,
						children: [
							{
								path: '',
								element: <Profile />,
							},
						],
					}
				],
			},
			{
				//Protected routes
				path: '/training',
				element: <AuthProtectedRoute />,
				children: [
					{
						element: <AppLayout />,
						children: [
							{
								path: '',
								element: <TrainingHome />,
							},
						],
					},
					{
						path: 'reorder-exercises',
						element: <ReorderExercises />,
					},
					{
						element: <WorkoutLayout />,
						children: [
							{
								path: 'exercise-overview',
								element: <ExerciseOverview />,
							},
							{
								path: 'view-workout',
								element: <ViewWorkout />,
							},
							{
								path: 'create-new-workout',
								element: <CreateNewWorkout />,
							},
							{
								path: 'create-routine',
								element: <CreateRoutine />,
							},
							{
								path: 'edit-routine/:id',
								element: <EditRoutine />,
							},
							{
								path: 'edit-workout/:id',
								element: <EditWorkout />,
							},
						],
					},
					{
						element: <ExerciseListLayout />,
						children: [
							{
								path: 'exercise-list',
								element: <ExerciseList />,
							}
						]
					}
				],
			},
		],
	},
	{
		path: '*',
		element: <NotFound />,
	},
]);

export default router;