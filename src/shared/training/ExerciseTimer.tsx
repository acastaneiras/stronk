import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import { useTimerStore } from '@/stores/timerStore';
import { getCategoryColor } from '@/utils/workoutUtils';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type ExerciseTimerProps = {
  workoutExercises: WorkoutExerciseType[];
};

const ExerciseTimer = ({ workoutExercises }: ExerciseTimerProps) => {
  const { activeExerciseId, activeSetId, startTimestamp, interval, startTimer, stopTimer } = useTimerStore();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const currentExercise = workoutExercises.find((exercise) => exercise.id === activeExerciseId);

  const playSound = () => {
    
    const audio = new Audio('/stronk/sounds/notification.mp3');
    audio.play().catch((error) => {
      toast.error('Error playing sound: ' + error.message);
    });
    toast.success('Time is up!');
  };


  useEffect(() => {
    let found = false;

    // Find the first incomplete set that needs to be timed
    for (const exercise of workoutExercises) {
      for (const set of exercise.sets) {
        if (!set.completed) {
          startTimer(exercise.id as string, set.id.toString(), exercise.setInterval || 0);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      // If all the sets are completed, stop the timer
      stopTimer();
    }
  }, [workoutExercises, startTimer, stopTimer]);

  useEffect(() => {
    if (!activeExerciseId || !activeSetId || !startTimestamp || !interval) {
      setRemainingTime(null);
      return;
    }

    const updateRemainingTime = () => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      const timeLeft = Math.max(interval - elapsed, 0);
      setRemainingTime(timeLeft);

      // Stop the timer when the time is up
      if (timeLeft <= 0) {
        stopTimer();
        playSound();
      }
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [activeExerciseId, activeSetId, startTimestamp, interval, stopTimer]);

  if (remainingTime === null) {
    return null;
  }
  const getTimeDisplay = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-20 left-0 w-full z-50 flex justify-center">
      <Card className="w-full max-w-md bg-secondary shadow border-2 border-primary">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6" />
            <CardTitle className="text-lg font-semibold">Rest Timer</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-3xl font-bold text-primary tracking-wide">{getTimeDisplay(remainingTime)}</p>
          {currentExercise && (
            <div className="mt-4">
              <p className="text-sm font-bold">
                {currentExercise.exercise.name} #{activeSetId}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {currentExercise.exercise.category && (
                  <Badge
                    className={`px-2 py-1 rounded text-white flex-grow-0 text-xs`}
                    style={{ backgroundColor: `${getCategoryColor(currentExercise.exercise.category)}` }}
                  >
                    {currentExercise.exercise.category}
                  </Badge>
                )}
                {currentExercise.exercise.primaryMuscles?.slice(0, 1).map((muscle) => (
                  <Badge
                    key={muscle}
                    variant="outline"
                    className="px-2 py-1 rounded flex-grow-0 text-xs capitalize"
                  >
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseTimer;
