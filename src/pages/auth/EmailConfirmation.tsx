import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { getCurrentUser } from '@/utils/authUtils';
import { useUserStore } from '@/stores/userStore';

export default function EmailConfirmation() {
	const {setUser} = useUserStore();
	const location = useLocation();
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	useEffect(() => {
		const params = new URLSearchParams(location.search || location.hash.replace('#', '?'));
		const urlError = params.get('error');
		const errorDescription = params.get('error_description');

		if (urlError) {
			setErrorMessage(decodeURIComponent(errorDescription || 'An unknown error occurred.'));
		} else {
			setSuccessMessage('Email verified successfully!');
			const fetchUser = async () => {
				const user = await getCurrentUser();
				setUser(user);
			}
			fetchUser();
			
			setTimeout(() => {
				navigate('/training');
			}, 3000);
		}
	}, [location, navigate, setUser]);

	return (
		<div className="flex h-screen items-center justify-center">
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle>Email Verification</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center">
						{errorMessage ? (
							<p className="text-red-500 mb-4">{errorMessage}</p>
						) : (
							<>
								<p className="text-green-500 mb-4">{successMessage}</p>
								<p>Redirecting shortly...</p>
							</>
						)}
					</div>
				</CardContent>
				<CardFooter className="text-center text-sm text-gray-500">
					If you encounter issues, please contact <a href="mailto:stronk.app@gmail.com">stronk.app@gmail.com</a>
				</CardFooter>
			</Card>
		</div>
	);
}
