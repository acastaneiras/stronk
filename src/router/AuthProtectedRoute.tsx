import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const AuthProtectedRoute = () => {
	const { session } = useSession();
	if (!session) {
		//redirect to sign in with react router
		return <Navigate to="/sign-in" />;
	}
	return <Outlet />;
};

export default AuthProtectedRoute;