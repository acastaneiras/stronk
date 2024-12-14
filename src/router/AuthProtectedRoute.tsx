import { useExercisesStore } from "@/stores/exerciseStore";
import { loadData } from "@/utils/exerciseDataLoader";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const AuthProtectedRoute = () => {
	const { session } = useSession();
	const exercisesStore = useExercisesStore();
	
	useEffect(() => {
		if (session && exercisesStore.isHydrated) {
			//load data if there is a session, the store is hydrated and there *IS* a change of version
			loadData(exercisesStore);
		}
	}, [session, exercisesStore.isHydrated]);

	if (!session) {
		//redirect to sign in with react router
		return <Navigate to="/sign-in" />;
	} 	
	return <Outlet />;
};

export default AuthProtectedRoute;