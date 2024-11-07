import { Loader } from 'lucide-react';

const LoadingPage = () => {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100">
      <section className="text-center flex flex-col items-center justify-center ">
        <Loader className="animate-spin h-16 w-16 text-gray-700 text-center" />
        <h1 className="text-2xl font-semibold text-gray-700 mt-4">Loading</h1>
        <p className="text-sm text-gray-500">Please wait while we prepare everything for you.</p>
      </section>
    </main>
  );
};

export default LoadingPage;
