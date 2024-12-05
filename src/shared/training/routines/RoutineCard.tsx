import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Routine } from '@/models/Workout';
import { getCategoryColor } from "@/utils/workoutUtils";
import { useMemo } from 'react';
import { Play } from 'lucide-react';

const RoutineCard = ({ routine }: { routine: Routine }) => {
  const categories = useMemo(
    () => Array.from(new Set(routine.workout_exercises.map((we) => we.exercise.category).filter(Boolean))),
    [routine.workout_exercises]
  );

  const primaryMuscles = useMemo(
    () => Array.from(new Set(
      routine.workout_exercises.flatMap((we) => we.exercise.primaryMuscles || [])
    )).map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1).toLowerCase()),
    [routine.workout_exercises]
  );

  const exerciseNames = useMemo(
    () => routine.workout_exercises.map((we) => we.exercise.name),
    [routine.workout_exercises]
  );

  return (
    <Card className="relative border shadow-none bg-secondary/80">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-semibold line-clamp-2">{routine.title}</CardTitle>
          <CardDescription className="">
            <span className='line-clamp-2'><span className='font-bold text-sm text-muted-foreground'>{routine.workout_exercises.length} exercises:</span> {exerciseNames.join(', ')}</span>
            {primaryMuscles.length > 0 && (
              <span className='flex flex-row items-center pt-1 line-clamp-2 gap-1'>
                <span className="font-bold text-sm text-muted-foreground">Primary muscles:</span> {primaryMuscles.join(', ')}
              </span>
            )}
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          {categories.map((category) => (
            <Badge
              key={category}
              className="px-2 py-1"
              style={{
                backgroundColor: getCategoryColor(category as string),
              }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">
          <Play /> Start Routine</Button>
      </CardFooter>
    </Card>
  );
};

export default RoutineCard;
