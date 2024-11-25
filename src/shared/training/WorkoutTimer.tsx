import { useWorkoutStore } from '@/stores/workoutStore';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export type TimerHandle = {
  saveTimer: () => void
}

const WorkoutTimer = forwardRef<TimerHandle>((_Props, ref) => {
  const { workout, updateWorkoutDuration, isTimerEnabled } = useWorkoutStore();
  const [timer, setTimer] = useState<number>((workout !== null && workout.duration !== null) ? workout.duration : 0);

  const timerInterval = null;
  useEffect(() => {
    setTimer((workout !== null && workout.duration !== null) ? workout.duration : 0)
  }, [workout?.duration, workout])

  useEffect(() => {
    //A timer that will run and update every second
    setTimer((workout !== null && workout.duration !== null) ? workout.duration : 0)

    if (isTimerEnabled) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer: number) => prevTimer + 1);

      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [isTimerEnabled, workout]);

  useImperativeHandle(ref, () => ({
    saveTimer() {
      updateWorkoutDuration(timer);
      setTimer(0);
      clearInterval(timerInterval!);
    }
  }))

  const displayTime = () => {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    let timeString = '';

    if (hours > 0) {
      timeString += `${hours}h`;
    }
    if (minutes > 0) {
      timeString += ` ${minutes}m`;
    }
    if (seconds > 0) {
      timeString += `${seconds}s`;
    }

    return timeString;
  };

  return <span >{displayTime()}</span>;
})

export default WorkoutTimer;