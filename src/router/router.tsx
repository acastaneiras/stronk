
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from '@/layouts/AuthLayout';
import HomeLayout from '@/layouts/HomeLayout';
import ProfileLayout from '@/layouts/ProfileLayout';
import TrainingLayout from '@/layouts/TrainingLayout';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import Welcome from '@/pages/Welcome';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Profile from '@/pages/profile/Profile';
import TrainingHome from '@/pages/training/TrainingHome';
import ExerciseList from '@/pages/training/ExerciseList';
import ExerciseOverview from '@/pages/training/ExerciseOverview';
import ReorderExercises from '@/pages/training/ReorderExercises';
import ViewWorkout from '@/pages/training/ViewWorkout';
import CreateNewWorkout from '@/pages/training/workout/CreateNewWorkout';
import CreateRoutine from '@/pages/training/workout/CreateRoutine';
import EditRoutine from '@/pages/training/workout/EditRoutine';
import EditWorkout from '@/pages/training/workout/EditWorkout';
import EmailConfirmation from "@/pages/auth/EmailConfirmation";
import AuthProtectedRoute from "./AuthProtectedRoute";
import Providers from "@/Providers";


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
						element: <ProfileLayout />,
						children: [
							{
								path: '',
								element: <Profile />,
							},
						],
					},
				],
			},
			{
				//Protected routes
				path: '/training',
				element: <AuthProtectedRoute />,
				children: [
					{
						element: <TrainingLayout />,
						children: [
							{
								path: '',
								element: <TrainingHome />,
							},
							{
								path: 'exercise-list',
								element: <ExerciseList />,
							},
							{
								path: 'exercise-overview',
								element: <ExerciseOverview />,
							},
							{
								path: 'reorder-exercises',
								element: <ReorderExercises />,
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
								path: 'edit-routine',
								element: <EditRoutine />,
							},
							{
								path: 'edit-workout',
								element: <EditWorkout />,
							},
						],
					},
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