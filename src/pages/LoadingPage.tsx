import LoadingAnimation from '@/shared/LoadingAnimation';

const LoadingPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-background dark:bg-background">
        <LoadingAnimation />
    </div>
  );
};

export default LoadingPage;
