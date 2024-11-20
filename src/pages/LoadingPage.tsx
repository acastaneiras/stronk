import LoadingAnimation from '@/shared/LoadingAnimation';

const LoadingPage = () => {
  return (
    <main className="flex h-screen items-center justify-center bg-background dark:bg-background">
        <LoadingAnimation />
    </main>
  );
};

export default LoadingPage;
