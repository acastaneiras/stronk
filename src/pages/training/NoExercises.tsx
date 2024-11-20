import { Dumbbell } from "lucide-react";

const NoExercises = () => {
  return (
    <div
      className="flex flex-col items-center justify-center space-y-4 px-6 pb-12"
    >
      <div className="flex flex-col items-center space-y-2">
        <Dumbbell className=" h-12 w-12" />
        <h2 className="text-xl font-bold">No exercises</h2>
      </div>
      <p className="text-center">
        You can add new exercises to the workout by clicking the{' '}
        <span className="font-semibold text-primary">"Add Exercises"</span> button.
      </p>
    </div>
  );
}

export default NoExercises;
