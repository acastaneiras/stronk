import { Frown } from "lucide-react";

const NoExercisesFound = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <Frown className="h-16 w-16 text-gray-500 dark:text-gray-400" />
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
        No Exercises Found
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Try adjusting your filters or search to find exercises.
      </p>
    </div>
  );
};

export default NoExercisesFound;