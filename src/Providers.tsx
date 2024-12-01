import { Outlet } from "react-router-dom";
import { SessionProvider } from "@/context/SessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Providers = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<Outlet />
			</SessionProvider>
		</QueryClientProvider>
	);
};

export default Providers;