interface WorkoutProgressProps {
  workoutPercentage: number;
}

const WorkoutProgress = ({ workoutPercentage }: WorkoutProgressProps) => {
  const minPercentage = 45;
  const maxPercentage = 55;
  const clampedPercentage = Math.min(Math.max(workoutPercentage * 100, minPercentage), maxPercentage);
  const interpolatedWidth = ((clampedPercentage - minPercentage) / (maxPercentage - minPercentage)) * 100;

  return (
    <div className="relative w-full flex flex-col">
      <div className="absolute h-[10px] w-full">
        <div className="absolute h-full dark:bg-secondary bg-gray-300 rounded w-full"></div>
        <div
          className="absolute h-full bg-primary rounded"
          style={{ width: `${workoutPercentage * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-center flex-col items-center relative h-full">
        <div className="absolute flex overflow-hidden rounded-3xl w-[10%]">
          <div
            className="h-[24px] bg-primary"
            style={{ width: `${interpolatedWidth}%` }}
          ></div>
          <div className="h-[24px] dark:bg-secondary bg-gray-300 flex-grow"></div>
        </div>
        <div className="w-[10%] flex items-center justify-center">
          <span className="dark:text-white text-gray z-10 text-xs font-sans">
            {Math.round(workoutPercentage * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkoutProgress;
