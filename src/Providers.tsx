import { Outlet } from "react-router-dom";
import { SessionProvider } from "@/context/SessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeviceThemeManager from "@/shared/theme/DeviceThemeManager";

const queryClient = new QueryClient();

const Providers = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<DeviceThemeManager>
					<Outlet />
				</DeviceThemeManager>
			</SessionProvider>
		</QueryClientProvider>
	);
};

export default Providers;