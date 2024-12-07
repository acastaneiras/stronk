import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Routine } from '@/models/Workout';
import { getCategoryColor } from "@/utils/workoutUtils";
import { Edit, EllipsisVertical, Play, Trash } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const RoutineCard = ({ routine }: { routine: Routine }) => {
  const navigate = useNavigate();
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

  const handleEditRoutine = () => {
    navigate(`/training/edit-routine/${routine.id}`);
  }

  return (
    <Card className="relative border shadow-none bg-secondary/80">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="flex flex-row justify-between">
            <div>
              <h3 className="tracking-tight text-2xl font-semibold line-clamp-2">
                {routine.title}
              </h3>
            </div>
            <div className='pl-4'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <EllipsisVertical className="h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 flex flex-col gap-1">
                  <DropdownMenuItem asChild>
                    <Button variant="ghost" className="w-full justify-start border-none cursor-pointer" onClick={handleEditRoutine}>
                      <Edit className="h-4 w-4 mr-2" /> Edit routine
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button variant="destructive" onClick={() => console.log('Delete')} className="w-full justify-start border-none cursor-pointer">
                      <Trash className="h-4 w-4 mr-2" /> Delete routine
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
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
