import { useWorkoutStore } from '@/stores/workoutStore';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const WorkoutTimer = () => {
  const { workout } = useWorkoutStore();
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!workout?.date) {
    return <span>No workout started</span>;
  }

  const workoutStartTime = dayjs(workout.date);
  const elapsedSeconds = now.diff(workoutStartTime, 'second');
  const elapsedHours = Math.floor(elapsedSeconds / 3600);
  const elapsedMinutes = Math.floor((elapsedSeconds % 3600) / 60);
  const elapsedRemainingSeconds = elapsedSeconds % 60;

  return (
    <span>
      {elapsedHours > 0 && `${elapsedHours}h `}
      {elapsedMinutes > 0 && `${elapsedMinutes}m `}
      {elapsedRemainingSeconds}s
    </span>
  );
};

export default WorkoutTimer;
